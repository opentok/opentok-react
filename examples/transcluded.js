'use strict';

import AppConfig from './config';
import {OTSession, OTPublisher, OTSubscriber} from '../src'

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: []
    };

    this.onStreamsUpdated = streams => this.setState({ streams });
  }

  renderSubscribers() {
    return this.state.streams.map(stream => {
      return (
        <OTSubscriber key={stream.id} stream={stream} />
      );
    });
  }

  render() {
    return (
      <OTSession
        apiKey={AppConfig.API_KEY}
        sessionId={AppConfig.SESSION_ID}
        token={AppConfig.TOKEN}
        onStreamsUpdated={this.onStreamsUpdated}>

        <OTPublisher />
        {this.renderSubscribers()}

      </OTSession>
    );
  }
}

OT.registerScreenSharingExtension('chrome', AppConfig.CHROME_EXTENSION_ID, 2);
ReactDOM.render(<App />, document.getElementById('content'));
