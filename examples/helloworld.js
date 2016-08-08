'use strict';

import AppConfig from './config';
import {OTSession} from '../src'

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <OTSession
        apiKey={AppConfig.API_KEY}
        sessionId={AppConfig.SESSION_ID}
        token={AppConfig.TOKEN}
      />
    );
  }
}

OT.registerScreenSharingExtension('chrome', AppConfig.CHROME_EXTENSION_ID, 2);
ReactDOM.render(<App />, document.getElementById('content'));
