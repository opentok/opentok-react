import React from 'react';
import { mount } from 'enzyme';
import createSession from '../src/createSession.js';

describe('createSession', () => {
  let session,
    onStreamCreated,
    onStreamDestroyed,
    onStreamsUpdated,
    options,
    sessionHelper;

  beforeEach(() => {
    session = jasmine.createSpyObj('session', [
      'on',
      'off',
      'connect',
      'disconnect'
    ]);

    session.on.and.callFake(eventHandlers => {
      onStreamCreated = eventHandlers.streamCreated;
      onStreamDestroyed = eventHandlers.streamDestroyed;
    });

    spyOn(OT, 'initSession').and.returnValue(session);

    onStreamsUpdated = jasmine.createSpy('onStreamsUpdated');

    options = {
      apiKey: 'fakeApiKey',
      sessionId: 'fakeSessionId',
      token: 'fakeToken',
      onStreamsUpdated
    };

    sessionHelper = createSession(options);
  });

  it('should call OT.initSession', () => {
    expect(OT.initSession).toHaveBeenCalledWith(options.apiKey, options.sessionId);
  });

  it('should call session.on', () => {
    expect(session.on).toHaveBeenCalledWith(jasmine.objectContaining({
      streamCreated: jasmine.any(Function),
      streamDestroyed: jasmine.any(Function)
    }));
  });

  it('should call session.connect', () => {
    expect(session.connect).toHaveBeenCalledWith(options.token);
  });

  it('should return session helper', () => {
    expect(sessionHelper).toEqual({
      session,
      streams: jasmine.any(Array),
      disconnect: jasmine.any(Function)
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
      streamDestroyed: onStreamDestroyed
    }));
  });

  it('should call session.disconnect on disconnect', () => {
    expect(session.disconnect).not.toHaveBeenCalled();
    sessionHelper.disconnect();
    expect(session.disconnect).toHaveBeenCalled();
  });
});
