import axios from 'axios';

const libraryPackage = require('../../package.json');

const logAnalyticsEvent = (apiKey, sessionId, action, connectionId) => {
  const body = {
    payload: {
      opentok_react_version: libraryPackage.version,
    },
    payload_type: 'info',
    action,
    partnerId: apiKey,
    sessionId,
    source: libraryPackage.repository.url,
  };

  if (connectionId) {
    body.connectionId = connectionId;
  }

  axios({
    url: 'https://hlg.tokbox.com/prod/logging/ClientEvent',
    method: 'post',
    data: JSON.stringify(body),
  })
    .catch(() => {
      console.log('Error sending log, ignoring log');
    });
};

export {
    // eslint-disable-next-line import/prefer-default-export
    logAnalyticsEvent,
};
