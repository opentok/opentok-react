'use strict';

import AppConfig from './config';
import {OTSession, OTPublisher} from '../src'

import React from 'react';
import ReactDOM from 'react-dom';

class ScreenPublisher extends OTPublisher {
  render() {
    console.log('ScreenPublisher.render()');
    return (<div><h3>Screen Publisher {this.state.lastStreamId}</h3></div>);
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOn: false,
      publishCamera: true,
      publishScreen: false,
      showSubscribers: true
    };
    this.sessionEventHandlers = {
      sessionConnected: this.sessionConnectedHandler.bind(this),
      sessionDisconnected: this.sessionDisconnectedHandler.bind(this)
    };
    this.handleIsOnChange = this.handleIsOnChange.bind(this);
    this.handlePublishCameraChange = this.handlePublishCameraChange.bind(this);
    this.handlePublishScreenChange = this.handlePublishScreenChange.bind(this);
    this.handleShowSubscribersChange = this.handleShowSubscribersChange.bind(this);
  }

  sessionConnectedHandler(event) {
    console.log('Session.sessionConnectedHandler()', event);
  }

  sessionDisconnectedHandler(event) {
    console.log('Session.sessionDisconnectedHandler()', event);
  }

  handleIsOnChange() {
    this.setState({
      isOn: this.refs.isOnInput.checked
    });
  }

  handlePublishCameraChange() {
    this.setState({
      publishCamera: this.refs.publishCameraInput.checked
    });
  }

  handlePublishScreenChange() {
    this.setState({
      publishScreen: this.refs.publishScreenInput.checked
    });
  }

  handleShowSubscribersChange() {
    this.setState({
      showSubscribers: this.refs.showSubscribersInput.checked
    });
  }

  generatePublishers() {
    let publishers = {};

    if (this.state.publishCamera) {
      publishers.camera = {};
    }

    if (this.state.publishScreen) {
      publishers.screen = {
        component: ScreenPublisher,
        properties: {
          audioSource: null,
          videoSource: 'window'
        },
        eventHandlers: {
          videoElementCreated: event => {
            event.element.setAttribute('style', 'width:100%');
          }
        }
      };
    }

    return publishers;
  }

  generateSubscribers() {
    let subscribers = false;

    if (this.state.showSubscribers) {
      subscribers = {};
    }

    return subscribers;
  }

  render() {
    console.log('App.render()');
    let session,
        controls;

    if (this.state.isOn) {
      session = <OTSession
          apiKey={AppConfig.API_KEY}
          sessionId={AppConfig.SESSION_ID}
          token={AppConfig.TOKEN}
          publishers={this.generatePublishers()}
          subscribers={this.generateSubscribers()}
          sessionEventHandlers={this.sessionEventHandlers}
        />;
      controls = <div>
          <div>
            <input
              type="checkbox"
              checked={this.state.publishCamera}
              ref="publishCameraInput"
              id="publishCameraCheckbox"
              onChange={this.handlePublishCameraChange}
            />
          <label htmlFor="publishCameraCheckbox">Publish Camera</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={this.state.publishScreen}
              ref="publishScreenInput"
              id="publishScreenCheckbox"
              onChange={this.handlePublishScreenChange}
            />
          <label htmlFor="publishScreenCheckbox">Publish Screen</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={this.state.showSubscribers}
              ref="showSubscribersInput"
              id="showSubscribersCheckbox"
              onChange={this.handleShowSubscribersChange}
            />
          <label htmlFor="showSubscribersCheckbox">Show Subcribers</label>
          </div>
        </div>;
    }
    return (
      <div>
        <div>
          <input
            type="checkbox"
            checked={this.state.isOn}
            ref="isOnInput"
            id="isOnCheckbox"
            onChange={this.handleIsOnChange}
          />
        <label htmlFor="isOnCheckbox">Toggle Session</label>
        </div>
        {controls}
        {session}
      </div>
    );
  }
}

OT.registerScreenSharingExtension('chrome', AppConfig.CHROME_EXTENSION_ID, 2);
ReactDOM.render(<App />, document.getElementById('content'));
