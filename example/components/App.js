import React, { Component } from "react";

import { OTSession, OTStreams, preloadScript, OTWhiteBoard } from "../../src";
import ConnectionStatus from "./ConnectionStatus";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import config from "../config";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
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
    OT.registerScreenSharingExtension("chrome", config.CHROME_EXTENSION_ID, 2);
  }

  onError = err => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };

  render() {
    return (
      <OTSession
        apiKey={this.props.apiKey}
        sessionId={this.props.sessionId}
        token={this.props.token}
        eventHandlers={this.sessionEvents}
        onError={this.onError}
      >
        <OTWhiteBoard width={600} height={600}  />

        {/*{this.state.error ? <div>{this.state.error}</div> : null}*/}
        {/*<Publisher />*/}
        {/*<OTStreams>*/}
        {/*  <Subscriber />*/}
        {/*</OTStreams>*/}
      </OTSession>
    );
  }
}

export default preloadScript(App);
