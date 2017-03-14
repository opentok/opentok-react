import React from 'react';
import { mount } from 'enzyme';
import preloadScript from '../src/preloadScript.js';

describe('preloadScript', () => {

  it('Should render loadingDelegate when OT is not available', () => {
    const __oldOT = global.OT;
    global.OT = undefined;

    const OTModule = preloadScript(() => <div className="opentok-module" />);
    const wrapper = mount(
      <OTModule loadingDelegate={<div className="loading-delegate" />} />
    );

    const divContainer = wrapper.render().find('div.loading-delegate');
    expect(divContainer.length).toBe(1);

    global.OT = __oldOT;
  });

  it('Should render its inner component when OT is available', () => {
    const __oldOT = global.OT;
    global.OT = {};

    const OTModule = preloadScript(() => <div className="opentok-module" />);
    const wrapper = mount(
      <OTModule loadingDelegate={<div className="loading-delegate" />} />
    );

    const divContainer = wrapper.render().find('div.opentok-module');
    expect(divContainer.length).toBe(1);

    global.OT = __oldOT;
  });
});
