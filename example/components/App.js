import React, { Component } from 'react';

import { OTSession, OTStreams, preloadScript } from '../../src'
import ConnectionStatus from './ConnectionStatus';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import config from '../config';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false
    };

    this.sessionEvents = {
      sessionConnected: () => {
        this.setState({ connected: true });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false });
      }
    };
  }

  componentWillMount() {
    OT.registerScreenSharingExtension('chrome', config.CHROME_EXTENSION_ID, 2);
  }

  render() {
    return (
      <OTSession
        apiKey={this.props.apiKey}
        sessionId={this.props.sessionId}
        token={this.props.token}
        eventHandlers={this.sessionEvents}
      >
        <ConnectionStatus connected={this.state.connected} />
        <Publisher />
        <OTStreams>
          <Subscriber />
        </OTStreams>
      </OTSession>
    );
  }
}

export default preloadScript(App);