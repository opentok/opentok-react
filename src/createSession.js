export default function createSession({
  apiKey, sessionId, token, onStreamsUpdated
}) {
  let streams = [];

  let onStreamCreated = event => {
    let index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index < 0) {
      streams.push(event.stream);
      onStreamsUpdated(streams);
    }
  };

  let onStreamDestroyed = event => {
    let index = streams.findIndex(stream => stream.id === event.stream.id);
    if (index >= 0) {
      streams.splice(index, 1);
      onStreamsUpdated(streams);
    }
  };

  let eventHandlers = {
    streamCreated: onStreamCreated,
    streamDestroyed: onStreamDestroyed
  };

  let session = OT.initSession(apiKey, sessionId);
  session.on(eventHandlers);
  session.connect(token);

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
      eventHandlers = null;
      session = null;

      this.session = null;
      this.streams = null;
    }
  };
}
