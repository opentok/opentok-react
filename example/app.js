import React from 'react';
import { render } from 'react-dom';

import config from './config';
import App from './components/App';

render((
  <App
    apiKey={config.API_KEY}
    sessionId={config.SESSION_ID}
    token={config.TOKEN}
    loadingDelegate={<div>Loading...</div>}
    opentokClientUrl="https://static.opentok.com/v2/js/opentok.min.js"
  />
), document.getElementById('content'));
