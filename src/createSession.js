import axios from 'axios';

const libraryPackage = require('../package.json');

const logAnalyticsEvent = (apiKey, sessionId, action, connectionId) => {
  const body = {
    payload: {
      opentok_react_version: libraryPackage.version,
    },
    payload_type: 'info',
    action,
    partner_id: apiKey,
    session_id: sessionId,
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
    .then(() => {
      // response complete
    })
    .catch(() => {
      console.log('logging error');
    });
};

export default function createSession({
  apiKey,
  sessionId,
  token,
  onStreamsUpdated,
  onConnect,
  onError,
} = {}) {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!sessionId) {
    throw new Error('Missing sessionId');
  }

  if (!token) {
    throw new Error('Missing token');
  }

  let streams = [];

  let onStreamCreated = (event) => {
    const index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index < 0) {
      streams.push(event.stream);
      onStreamsUpdated(streams);
    }
  };

  let onStreamDestroyed = (event) => {
    const index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index >= 0) {
      streams.splice(index, 1);
      onStreamsUpdated(streams);
    }
  };

  let onSessionConnected = (event) => {
    logAnalyticsEvent(apiKey, sessionId, 'react_connected', event.target.connection.connectionId);
  };

  let eventHandlers = {
    streamCreated: onStreamCreated,
    streamDestroyed: onStreamDestroyed,
    sessionConnected: onSessionConnected,
  };

  let session = OT.initSession(apiKey, sessionId);
  logAnalyticsEvent(apiKey, sessionId, 'react_initialize');
  session.on(eventHandlers);
  session.connect(token, (err) => {
    if (!session) {
      // Either this session has been disconnected or OTSession
      // has been unmounted so don't invoke any callbacks
      return;
    }
    if (err && typeof onError === 'function') {
      onError(err);
    } else if (!err && typeof onConnect === 'function') {
      onConnect();
    }
  });

  return {
    session,
    streams,
    disconnect() {
      if (session) {
        session.off(eventHandlers);
        session.disconnect();
      }

      streams = null;
      onStreamCreated = null;
      onStreamDestroyed = null;
      onSessionConnected = null;
      eventHandlers = null;
      session = null;

      this.session = null;
      this.streams = null;
    },
  };
}
