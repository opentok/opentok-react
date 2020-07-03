import createSession from '../src/createSession';

describe('createSession', () => {
  beforeEach(() => {
    spyOn(OT, 'initSession');
  });

  describe('required credentials', () => {
    it('should throw when missing apiKey', () => {
      expect(() => {
        createSession();
      }).toThrowError(/Missing apiKey/);
    });

    it('should throw when missing sessionId', () => {
      expect(() => {
        createSession({ apiKey: 'fakeApiKey' });
      }).toThrowError(/Missing sessionId/);
    });

    it('should throw when missing token', () => {
      expect(() => {
        createSession({ apiKey: 'fakeApiKey', sessionId: 'fakeSessionId' });
      }).toThrowError(/Missing token/);
    });
  });

  describe('all options', () => {
    let session;
    let onStreamCreated;
    let onStreamDestroyed;
    let onStreamsUpdated;
    let options;
    let sessionHelper;

    beforeEach(() => {
      session = jasmine.createSpyObj('session', [
        'on',
        'off',
        'connect',
        'disconnect',
      ]);

      session.on.and.callFake((eventHandlers) => {
        onStreamCreated = eventHandlers.streamCreated;
        onStreamDestroyed = eventHandlers.streamDestroyed;
      });

      OT.initSession.and.returnValue(session);

      onStreamsUpdated = jasmine.createSpy('onStreamsUpdated');

      options = {
        apiKey: 'fakeApiKey',
        sessionId: 'fakeSessionId',
        token: 'fakeToken',
        onStreamsUpdated,
        options: {
          connectionEventSurpressed: true,
        },
      };

      sessionHelper = createSession(options);
    });

    it('should call OT.initSession', () => {
      expect(OT.initSession).toHaveBeenCalledWith(
        options.apiKey,
        options.sessionId,
        options.options,
      );
    });

    it('should call session.on', () => {
      expect(session.on).toHaveBeenCalledWith(jasmine.objectContaining({
        streamCreated: jasmine.any(Function),
        streamDestroyed: jasmine.any(Function),
      }));
    });

    it('should call session.connect', () => {
      expect(session.connect).toHaveBeenCalledWith(options.token, jasmine.any(Function));
    });

    it('should return session helper', () => {
      expect(sessionHelper).toEqual({
        session,
        streams: jasmine.any(Array),
        disconnect: jasmine.any(Function),
      });
    });

    it('should add stream to streams array', () => {
      expect(sessionHelper.streams.length).toBe(0);
      expect(onStreamsUpdated).not.toHaveBeenCalled();

      const stream = { id: 'fakeStreamId' };
      onStreamCreated({ stream });

      expect(sessionHelper.streams.length).toBe(1);
      expect(sessionHelper.streams[0]).toBe(stream);
      expect(onStreamsUpdated).toHaveBeenCalledWith(sessionHelper.streams);
    });

    it('should not add duplicate stream to streams array', () => {
      const stream = { id: 'fakeStreamId' };
      sessionHelper.streams.push(stream);

      expect(sessionHelper.streams.length).toBe(1);
      expect(onStreamsUpdated).not.toHaveBeenCalled();

      onStreamCreated({ stream });

      expect(sessionHelper.streams.length).toBe(1);
      expect(sessionHelper.streams[0]).toBe(stream);
      expect(onStreamsUpdated).not.toHaveBeenCalled();
    });

    it('should remove existing stream from streams array', () => {
      const stream = { id: 'fakeStreamId' };
      sessionHelper.streams.push(stream);

      expect(sessionHelper.streams.length).toBe(1);
      expect(onStreamsUpdated).not.toHaveBeenCalled();

      onStreamDestroyed({ stream });

      expect(sessionHelper.streams.length).toBe(0);
      expect(onStreamsUpdated).toHaveBeenCalledWith(sessionHelper.streams);
    });

    it('should not remove unknown stream from streams array', () => {
      const stream = { id: 'fakeStreamId' };
      sessionHelper.streams.push(stream);

      expect(sessionHelper.streams.length).toBe(1);
      expect(onStreamsUpdated).not.toHaveBeenCalled();

      onStreamDestroyed({ stream: { id: 'otherFakeStreamId' } });

      expect(sessionHelper.streams.length).toBe(1);
      expect(onStreamsUpdated).not.toHaveBeenCalled();
    });

    it('should call session.off on disconnect', () => {
      expect(session.off).not.toHaveBeenCalled();
      sessionHelper.disconnect();
      expect(session.off).toHaveBeenCalledWith(jasmine.objectContaining({
        streamCreated: onStreamCreated,
        streamDestroyed: onStreamDestroyed,
      }));
    });

    it('should call session.disconnect on disconnect', () => {
      expect(session.disconnect).not.toHaveBeenCalled();
      sessionHelper.disconnect();
      expect(session.disconnect).toHaveBeenCalled();
    });
  });
});
