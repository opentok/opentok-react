import React from 'react';
import { mount } from 'enzyme';
import OTSession from '../src/OTSession';

const MyComponent = () => <div />;

describe('OTSession', () => {
  let session;
  let wrapper;
  let apiKey;
  let sessionId;
  let token;

  beforeEach(() => {
    session = jasmine.createSpyObj('session', [
      'on',
      'off',
      'connect',
      'disconnect',
    ]);

    apiKey = 'fakeApiKey';
    sessionId = 'fakeSessionId';
    token = 'fakeToken';

    spyOn(OT, 'initSession').and.returnValue(session);
  });

  describe('missing credentials', () => {
    it('should throw when missing apiKey', () => {
      expect(() => {
        mount(<OTSession />);
      }).toThrowError(/Missing apiKey/);
    });

    it('should throw when missing sessionId', () => {
      expect(() => {
        mount(<OTSession apiKey={apiKey} />);
      }).toThrowError(/Missing sessionId/);
    });

    it('should throw when missing token', () => {
      expect(() => {
        mount(<OTSession apiKey={apiKey} sessionId={sessionId} />);
      }).toThrowError(/Missing token/);
    });
  });

  describe('without event handlers', () => {
    describe('without children', () => {
      beforeEach(() => {
        wrapper = mount((
          <OTSession apiKey={apiKey} sessionId={sessionId} token={token} />
        ));
      });

      it('should have a streams state', () => {
        expect(wrapper.state('streams')).toEqual(jasmine.any(Array));
      });

      it('should init and connect to a session', () => {
        expect(OT.initSession).toHaveBeenCalled();
        expect(session.on).toHaveBeenCalled();
        expect(session.on.calls.count()).toBe(1);
        expect(session.connect).toHaveBeenCalled();
      });

      it('should only call on once with one argument', () => {
        expect(session.on).toHaveBeenCalled();
        expect(session.on.calls.count()).toBe(1);

        const { args } = session.on.calls.first();
        expect(args.length).toBe(1);
        expect(args[0]).toEqual(jasmine.any(Object));
      });

      it('should update streams state when streamCreated triggered', () => {
        const { args } = session.on.calls.first();
        const onStreamCreated = args[0].streamCreated;
        expect(onStreamCreated).toEqual(jasmine.any(Function));

        const stream = { id: 'fakeStreamId' };
        onStreamCreated({ stream });
        expect(wrapper.state('streams')).toEqual([stream]);
      });

      it('should update streams state when streamDestroyed triggered', () => {
        const { args } = session.on.calls.first();
        const onStreamDestroyed = args[0].streamDestroyed;
        expect(onStreamDestroyed).toEqual(jasmine.any(Function));

        const stream = { id: 'fakeStreamId' };
        wrapper.state('streams').push(stream);

        expect(wrapper.state('streams')).toEqual([stream]);
        onStreamDestroyed({ stream });
        expect(wrapper.state('streams')).toEqual([]);
      });

      it('should call disconnect on umount', () => {
        expect(session.disconnect).not.toHaveBeenCalled();
        wrapper.unmount();
        expect(session.disconnect).toHaveBeenCalled();
      });

      it('should have no children', () => {
        expect(wrapper.children().length).toBe(0);
      });
    });

    describe('with children', () => {
      beforeEach(() => {
        wrapper = mount((
          <OTSession apiKey={apiKey} sessionId={sessionId} token={token}>
            <MyComponent />
            <MyComponent />
          </OTSession>
        ));
      });

      it('should have two children', () => {
        expect(wrapper.children().length).toBe(2);
      });
    });
  });

  describe('with event handlers', () => {

  });
});
