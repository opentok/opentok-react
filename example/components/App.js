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

    this.publisherEventHandlers = {
        accessDenied: () => {
          console.log('User denied access to media source')
        },
        accessAllowed: () => {
          console.log('User allowed access to media source')
        },
        streamCreated: () => {
          console.log('Publisher stream created')
        },
        streamDestroyed: ({ reason }) => {
          console.log(`Publisher stream destroyed, reason: ${reason}`)
        },
        disconnected: () => {
          console.log('Publisher disconnected')
        },
        destroyed: () => {
          console.log('Publisher destroyed')
        }
      }

    this.subscriberEventHandlers = {
          videoEnabled: () => {
            console.log('Subscriber video enabled')
          },
          videoDisabled: () => {
            console.log('Subscriber video disabled')
          },
          streamDestroyed: ({ reason }) => {
            console.log(`Subscriber stream destroyed, reason: ${reason}`)
          },
          connected: () => {
            console.log('Subscriber connected')
          },
          disconnected: () => {
            console.log('Subscriber disconnected')
          },
          destroyed: () => {
            console.log('Subscriber destroyed')
          }
      }
  }

  componentWillMount() {
    OT.registerScreenSharingExtension('chrome', config.CHROME_EXTENSION_ID, 2);
  }

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  }

  render() {
    return (
      <OTSession
        apiKey={this.props.apiKey}
        sessionId={this.props.sessionId}
        token={this.props.token}
        eventHandlers={this.sessionEvents}
        onError={this.onError}
      >
        {this.state.error ? <div>{this.state.error}</div> : null}
        <ConnectionStatus connected={this.state.connected} />
        <Publisher eventHandlers={this.publisherEventHandlers}/>
        <OTStreams>
          <Subscriber eventHandlers={this.subscriberEventHandlers}/>
        </OTStreams>
      </OTSession>
    );
  }
}

export default preloadScript(App);
