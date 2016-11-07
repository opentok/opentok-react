import React from 'react';
import ReactDOM from 'react-dom';

import config from './config';
import App from './components/App';

OT.registerScreenSharingExtension('chrome', config.CHROME_EXTENSION_ID, 2);
ReactDOM.render((
  <App
    apiKey={config.API_KEY}
    sessionId={config.SESSION_ID}
    token={config.TOKEN}
  />
), document.getElementById('content'));
