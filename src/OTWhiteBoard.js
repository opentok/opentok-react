import React, { Component } from 'react';
import PropTypes from 'prop-types';
import paper from 'paper/dist/paper-core';
import './whiteboard.css';

export default class OTWhiteBoard extends Component {
  constructor(props) {
    super(props);
    this.canvas;
    this.colors = [
      { backgroundColor: 'black' },
      { backgroundColor: 'blue' },
      { backgroundColor: 'red' },
      { backgroundColor: 'green' },
      { backgroundColor: 'orange' },
      { backgroundColor: 'purple' },
      { backgroundColor: 'brown' },
    ];
    this.captureButton;
    this.client = { dragging: false };
    this.count = 0; // Grabs the total count of each continuous stroke
    this.undoStack = []; // Stores the value of start and count for each continuous stroke
    this.redoStack = []; // When undo pops, data is sent to redoStack
    this.pathStack = [];
    this.drawHistory = [];
    this.drawHistoryReceivedFrom;
    this.drawHistoryReceived;
    this.batchUpdates = [];
    this.resizeTimeout;
    this.iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    this.strokeCap = 'round';
    this.strokeJoin = 'round';
    this.lineWidth = 1;
    this.color = 'black';
    this.erasing;
  }

  componentDidMount() {
    // Create an empty project and a view for the canvas:
    paper.setup(this.canvas);
    // Create a Paper.js Path to draw a line into it:
    this.canvas.width = this.props.width || 500;
    this.canvas.height = this.props.height || 500;

    // Set paper.js view size
    paper.view.viewSize = new paper.Size(this.canvas.width, this.canvas.height);
    paper.view.draw();
    // Draw the view now:
    paper.view.draw();
  }

  // eslint-disable-next-line react/sort-comp
  clearCanvas = () => {
    paper.project.clear();
    paper.view.update();
    this.drawHistory = [];
    this.pathStack = [];
    this.undoStack = [];
    this.redoStack = [];
    this.count = 0;
  };

  changeColor = selectedColor => {
    this.color = selectedColor.backgroundColor;
    this.erasing = false;
  };

  clear = () => {
    this.clearCanvas();
    // Session clear goes here
    if (this.props.session) {
      this.props.session.signal({
        type: 'otWhiteboard_clear',
      });
    }
  };

  erase = () => {
    this.erasing = true;
  };

  undo = () => {
    if (!this.undoStack.length) return;
    const uuid = this.undoStack.pop();
    this.undoWhiteBoard(uuid);
    this.sendUpdate('otWhiteboard_undo', uuid);
  };

  undoWhiteBoard = uuid => {
    this.redoStack.push(uuid);
    this.pathStack.forEach(path => {
      if (path.uuid === uuid) {
        path.visible = false;
        paper.view.update();
      }
    });
    this.drawHistory.forEach(update => {
      if (update.uuid === uuid) {
        update.visible = false;
      }
    });
  };

  redo = () => {
    if (!this.redoStack.length) return;
    const uuid = this.redoStack.pop();
    this.redoWhiteBoard(uuid);
    this.sendUpdate('otWhiteboard_redo', uuid);
  };

  redoWhiteBoard = uuid => {
    this.undoStack.push(uuid);
    this.pathStack.forEach(path => {
      if (path.uuid === uuid) {
        path.visible = true;
        paper.view.update();
      }
    });
    this.drawHistory.forEach(update => {
      if (update.uuid === uuid) {
        update.visible = true;
      }
    });
  };

  draw = update => {
    this.drawHistory.push(update);
    // console.log(update);
    switch (update.event) {
      case 'start':
        const path = new paper.Path();
        path.selected = false;
        path.strokeColor = update.color;
        path.strokeWidth = this.lineWidth;
        path.strokeCap = this.strokeCap;
        path.strokeJoin = this.strokeJoin;
        path.uuid = update.uuid;
        if (update.mode === 'eraser') {
          path.blendMode = 'destination-out';
          path.strokeWidth = 50;
        }

        if (update.visible !== undefined) {
          path.visible = update.visible;
        }
        const start = new paper.Point(update.fromX, update.fromY);
        path.moveTo(start);
        paper.view.draw();

        this.pathStack.push(path);
        break;
      case 'drag':
        this.pathStack.forEach(pathItem => {
          if (pathItem.uuid === update.uuid) {
            pathItem.add(update.toX, update.toY);
            paper.view.draw();
          }
        });
        break;
      case 'end':
        this.pathStack.forEach(pathItem => {
          if (pathItem.uuid === update.uuid) {
            this.undoStack.push(pathItem.uuid);
            pathItem.simplify();
            paper.view.draw();
          }
        });
        break;
    }
  };

  drawUpdates = updates => {
    updates.forEach(updateItem => {
      this.draw(updateItem);
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.session) {
      if (this.props.session.isConnected()) {
        this.requestHistory();
      }
      this.props.session.on({
        sessionConnected() {
          this.requestHistory();
        },
        'signal:otWhiteboard_update': event => {
          if (
            event.from.connectionId !==
            this.props.session.connection.connectionId
          ) {
            this.drawUpdates(JSON.parse(event.data));
          }
        },
        'signal:otWhiteboard_undo': event => {
          if (
            event.from.connectionId !==
            this.props.session.connection.connectionId
          ) {
            JSON.parse(event.data).forEach(data => {
              this.undoWhiteBoard(data);
            });
          }
        },
        'signal:otWhiteboard_redo': event => {
          if (
            event.from.connectionId !==
            this.props.session.connection.connectionId
          ) {
            JSON.parse(event.data).forEach(data => {
              this.redoWhiteBoard(data);
            });
          }
        },
        'signal:otWhiteboard_history': event => {
          // We will receive these from everyone in the room, only listen to the first
          // person. Also the data is chunked together so we need all of that person's
          if (
            !this.drawHistoryReceivedFrom ||
            this.drawHistoryReceivedFrom === event.from.connectionId
          ) {
            this.drawHistoryReceivedFrom = event.from.connectionId;
            this.drawUpdates(JSON.parse(event.data));
          }
        },
        'signal:otWhiteboard_clear': event => {
          console.log('clear');
          if (
            event.from.connectionId !==
            this.props.session.connection.connectionId
          ) {
            this.clearCanvas();
          }
        },
        'signal:otWhiteboard_request_history': event => {
          if (this.drawHistory.length > 0) {
            this.batchSignal(
              'otWhiteboard_history',
              this.drawHistory,
              event.from,
            );
          }
        },
      });
    }
  }

  onCanvas = event => {
    if (
      (event.type === 'mousemove' ||
        event.type === 'touchmove' ||
        event.type === 'mouseout') &&
      !this.client.dragging
    ) {
      // Ignore mouse move Events if we're not dragging
      return;
    }

    event.preventDefault();
    const { left, top } = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / event.target.width;
    const scaleY = this.canvas.height / event.target.height;
    const offsetX = event.clientX - left;
    const offsetY = event.clientY - top;
    const X = offsetX * scaleX;
    const Y = offsetY * scaleY;
    const mode = this.erasing ? 'eraser' : 'pen';
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.client.dragging = true;
      this.client.lastX = X;
      this.client.lastY = Y;
      this.client.uuid =
        parseInt(X) +
        parseInt(Y) +
        Math.random()
          .toString(36)
          .substring(2);
      const update = {
        id:
          this.props.session &&
          this.props.session.connection &&
          this.props.session.connection.connectionId,
        uuid: this.client.uuid,
        fromX: this.client.lastX,
        fromY: this.client.lastY,
        mode,
        color: this.color,
        event: 'start',
      };
      this.draw(update);
      this.sendUpdate('otWhiteboard_update', update);
    } else if (event.type === 'mousemove' || event.type === 'touchmove') {
      if (this.client.dragging) {
        // Build update object
        const update = {
          id:
            this.props.session &&
            this.props.session.connection &&
            this.props.session.connection.connectionId,
          uuid: this.client.uuid,
          fromX: this.client.lastX,
          fromY: this.client.lastY,
          toX: X,
          toY: Y,
          event: 'drag',
        };
        this.count++;
        this.redoStack = [];
        this.client.lastX = X;
        this.client.lastY = Y;
        this.draw(update);
        this.sendUpdate('otWhiteboard_update', update);
      }
    } else if (
      event.type === 'touchcancel' ||
      event.type === 'mouseup' ||
      event.type === 'touchend' ||
      event.type === 'mouseout'
    ) {
      if (this.count) {
        const update = {
          id:
            this.props.session &&
            this.props.session.connection &&
            this.props.session.connection.connectionId,
          uuid: this.client.uuid,
          event: 'end',
        };

        this.draw(update);
        this.sendUpdate('otWhiteboard_update', update);
      }

      this.client.dragging = false;
      this.client.uuid = false;
    }
  };

  batchSignal = (type, data, toConnection) => {
    // We send data in small chunks so that they fit in a signal
    // Each packet is maximum ~250 chars, we can fit 8192/250 ~= 32 updates per signal
    const dataCopy = data.slice();
    const signalError = err => {
      if (err) {
        console.error(err);
      }
    };
    while (dataCopy.length) {
      const dataChunk = dataCopy.splice(0, Math.min(dataCopy.length, 32));
      const signal = {
        type,
        data: JSON.stringify(dataChunk),
      };
      if (toConnection) signal.to = toConnection;
      this.props.session.signal(signal, signalError);
    }
  };

  updateTimeout;

  sendUpdate = (type, update, toConnection) => {
    if (this.props.session) {
      this.batchUpdates.push(update);
      if (!this.updateTimeout) {
        this.updateTimeout = setTimeout(() => {
          this.batchSignal(type, this.batchUpdates, toConnection);
          this.batchUpdates = [];
          this.updateTimeout = null;
        }, 100);
      }
    }
  };

  requestHistory = () => {
    this.props.session.signal({
      type: 'otWhiteboard_request_history',
    });
  };

  render() {
    return (
      <div className="ot-whiteboard">
        <canvas
          // hidpi="off"
          ref={ref => (this.canvas = ref)}
          onTouchCancel={this.onCanvas}
          onTouchEnd={this.onCanvas}
          onTouchMove={this.onCanvas}
          onTouchStart={this.onCanvas}
          onMouseDown={this.onCanvas}
          onMouseMove={this.onCanvas}
          onMouseUp={this.onCanvas}
          onMouseOut={this.onCanvas}
          id="myCanvas"
        />
        <div className="OT_panel">
          {this.colors.map(color => (
            <input
              type="button"
              key={color.backgroundColor}
              className="OT_color"
              style={color}
              onClick={() => this.changeColor(color)}
            />
          ))}
          <input
            type="button"
            onClick={this.erase}
            className="OT_erase"
            value="Eraser"
          />

          {/* <a */}
          {/*  className="OT_capture" */}
          {/*  download="whiteboard_capture.png" */}
          {/*  onClick={() => console.log('capture')} */}
          {/*  ref={ref => (captureButton = ref)} */}
          {/* > */}
          {/*  Capture */}
          {/* </a> */}
          <input
            type="button"
            onClick={this.undo}
            className="OT_capture"
            value="Undo"
          />

          <input
            type="button"
            onClick={this.redo}
            className="OT_capture"
            value="Redo"
          />

          <input
            type="button"
            onClick={this.clear}
            className="OT_clear"
            value="Clear"
          />
        </div>
      </div>
    );
  }
}
OTWhiteBoard.propTypes = {
  session: PropTypes.any.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
