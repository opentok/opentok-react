'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';

export default class OTPublisher extends React.Component {
  constructor(props) {
    console.log('OTPublisher()');
    super(props);

    this.state = {
      publisher: null,
      lastStreamId: ''
    };

    this.videoElementCreatedHandler = this.videoElementCreatedHandler.bind(this);
    this.streamCreatedHandler = this.streamCreatedHandler.bind(this);
    this.sessionConnectedHandler = this.sessionConnectedHandler.bind(this);
  }

  videoElementCreatedHandler(event) {
    console.log('OTPublisher.videoElementCreatedHandler()', event);
    ReactDOM.findDOMNode(this).appendChild(event.element);
  }

  streamCreatedHandler(event) {
    console.log('OTPublisher.streamCreatedHandler()', event);
    this.setState({ lastStreamId: event.stream.id });
  }

  sessionConnectedHandler(event) {
    console.log('OTPublisher.sessionConnectedHandler()', event);
    this.publishToSession(this.state.publisher);
  }

  publishToSession(publisher) {
    this.props.session.publish(publisher, err => {
      console.log('Publish callback', err);
      if (err) {
        console.error('Failed to publish to OpenTok session:', err);
      }
    });
  }

  componentDidMount() {
    console.log('OTPublisher.componentDidMount()');
    let properties = lodash.assign(
      {},
      this.props.properties,
      { insertDefaultUI: false }
    );
    let publisher = OT.initPublisher(properties);
    publisher.on('videoElementCreated', this.videoElementCreatedHandler);
    publisher.on('streamCreated', this.streamCreatedHandler);

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      publisher.on(this.props.eventHandlers);
    }

    if (this.props.session.connection) {
      this.publishToSession(publisher);
    } else {
      this.props.session.once('sessionConnected', this.sessionConnectedHandler);
    }

    this.setState({ publisher });
  }

  componentWillUnmount() {
    console.log('OTPublisher.componentWillUnmount()');
    if (this.props.session) {
      this.props.session.off('sessionConnected', this.sessionConnectedHandler);
    }

    if (this.state.publisher) {
      this.state.publisher.off({
        videoElementCreated: this.videoElementCreatedHandler,
        streamCreated: this.streamCreatedHandler
      });

      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.state.publisher.once('destroyed', () => {
          this.state.publisher.off(this.props.eventHandlers);
        });
      }

      this.props.session.unpublish(this.state.publisher);
      this.state.publisher.destroy();
    }
  }

  render() {
    console.log('OTPublisher.render()');
    return (<div><h3>Publisher {this.state.lastStreamId}</h3></div>);
  }
}

OTPublisher.propTypes = {
  session: React.PropTypes.object.isRequired,
  properties: React.PropTypes.object,
  eventHandlers: React.PropTypes.objectOf(React.PropTypes.func)
};

OTPublisher.defaultProps = {
  properties: {}
};
