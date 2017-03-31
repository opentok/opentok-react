import React from 'react';
import { mount } from 'enzyme';
import OTStreams from '../src/OTStreams';

const MyComponent = () => <div />;

describe('OTStreams', () => {
  beforeEach(() => {
    spyOn(console, 'error').and.callThrough();
  });

  describe('no children', () => {
    it('should log error if no session provided', () => {
      expect(() => {
        mount(<OTStreams />);
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringMatching('Failed prop type'),
        );
      }).not.toThrow();
    });

    it('should log error and throw if session provided', () => {
      expect(() => {
        mount(<OTStreams session={{}} />);
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringMatching('Failed prop type'),
        );
      }).toThrow();
    });
  });

  describe('multiple children', () => {
    it('should log error if no session provided', () => {
      expect(() => {
        mount(<OTStreams><MyComponent /><MyComponent /></OTStreams>);
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringMatching('Failed prop type'),
        );
      }).not.toThrow();
    });

    it('should log error and throw if session provided', () => {
      expect(() => {
        mount(<OTStreams session={{}}><MyComponent /><MyComponent /></OTStreams>);
        expect(console.error).toHaveBeenCalledWith(
          jasmine.stringMatching('Failed prop type'),
        );
      }).toThrow();
    });
  });

  describe('one child', () => {
    it('should not warn or throw if no session provided', () => {
      expect(() => {
        mount(<OTStreams><MyComponent /></OTStreams>);
        expect(console.error).not.toHaveBeenCalled();
      }).not.toThrow();
    });

    it('should not warn or throw if session provided', () => {
      expect(() => {
        mount((
          <OTStreams session={{}}>
            <MyComponent />
          </OTStreams>
        ));
        expect(console.error).not.toHaveBeenCalled();
      }).not.toThrow();
    });

    it('should not clone child if streams props is empty', () => {
      const wrapper = mount((
        <OTStreams session={{}}>
          <MyComponent />
        </OTStreams>
      ));
      expect(wrapper.find('MyComponent').length).toBe(0);
    });

    describe('with single stream prop', () => {
      let session;
      let streams;
      let wrapper;

      beforeEach(() => {
        session = {};
        streams = [{ id: 'fakeStreamId' }];
        wrapper = mount((
          <OTStreams session={session} streams={streams}>
            <MyComponent />
          </OTStreams>
        ));
      });

      it('should clone child and provide session and stream as props', () => {
        const child = wrapper.find('MyComponent');
        expect(child.length).toBe(1);
        expect(child.prop('session')).toBe(session);
        expect(child.prop('stream')).toBe(streams[0]);
      });
    });

    describe('with multiple stream prop', () => {
      let session;
      let streams;
      let wrapper;

      beforeEach(() => {
        session = {};
        streams = [{ id: 'fakeStreamId1' }, { id: 'fakeStreamId2' }];
        wrapper = mount((
          <OTStreams session={session} streams={streams}>
            <MyComponent />
          </OTStreams>
        ));
      });

      it('should clone child per stream and provide session and stream as props', () => {
        const children = wrapper.find('MyComponent');
        expect(children.length).toBe(2);
        children.forEach((child, index) => {
          expect(child.prop('session')).toBe(session);
          expect(child.prop('stream')).toBe(streams[index]);
        });
      });
    });
  });
});
