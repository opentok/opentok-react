import React, { Component } from 'react';

import { createSession } from '../../src'
import ConnectionStatus from './ConnectionStatus';
import Publisher from './Publisher';
import Subscribers from './Subscribers';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: [],
      connected: false
    };

    this.setConnected = this.setStateValue.bind(this, 'connected');
    this.setStreams = this.setStateValue.bind(this, 'streams');

    this.sessionEventHandlers = {
      sessionConnected: this.setConnected.bind(this, true),
      sessionDisconnected: this.setConnected.bind(this, false)
    };
  }

  setStateValue(key, value) {
    let state = {};
    state[key] = value;
    this.setState(state);
  }

  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: this.props.apiKey,
      sessionId: this.props.sessionId,
      token: this.props.token,
      onStreamsUpdated: this.setStreams
    });
    this.sessionHelper.session.on(this.sessionEventHandlers);
  }

  componentWillUnmount() {
    this.sessionHelper.session.off(this.sessionEventHandlers);
    this.sessionHelper.disconnect();
  }

  render() {
    return (
      <div>
        <ConnectionStatus connected={this.state.connected} />
        <Publisher session={this.sessionHelper.session} />
        <Subscribers
          session={this.sessionHelper.session}
          streams={this.state.streams}
        />
      </div>
    );
  }
}
