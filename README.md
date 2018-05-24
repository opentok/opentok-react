# opentok-react

[![npm version](https://badge.fury.io/js/opentok-react.svg)](https://badge.fury.io/js/opentok-react) [![Build Status](https://travis-ci.org/opentok/opentok-react.svg?branch=master)](https://travis-ci.org/opentok/opentok-react)

React components for OpenTok.js

## Contents

- [Pre-Requisites](#pre-requisites)
- [Install](#install)
- [Example App](#example-app)
- [Usage](#usage)
  - [Importing opentok-react](#importing-opentok-react)
  - [Example with OTSession Component](#example-with-otsession-component)
  - [Example with createSession Helper](#example-with-createsession-helper)
- [API Reference](#api-reference)
  - [OTSession Component](#otsession-component)
  - [OTPublisher Component](#otpublisher-component)
  - [OTStreams Component](#otstreams-component)
  - [OTSubscriber Component](#otsubscriber-component)
  - [createSession Helper](#createsession-helper)
  - [preloadScript Higher-Order Component](#preloadscript-higher-order-component)
- [Custom Build](#custom-build)
- [Contributing](#contributing)
- [Tests](#tests)

## Pre-Requisites

1. NodeJS
1. Register a TokBox account: https://tokbox.com/account/user/signup

## Install

Add `opentok-react` as a dependency of your application:

```sh
yarn add opentok-react
```

Or if you're still using npm:

```sh
npm install --save opentok-react
```

Then include `opentok.js` before your application:

```html
<script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
```

Alternatively, wrap your top-level component using OpenTok with the [`preloadScript`](#preloadscript-higher-order-component) HOC. The HOC will take care of loading `opentok.js` for you before rendering.

## Example App

There is an example application provided in `example/` and you can run it with the following steps:

1. `git clone https://github.com/opentok/opentok-react.git`
1. `cd opentok-react/example/`
1. `cp config.template.js config.js`
1. Edit `config.js`:
  1. Add your OpenTok API key, Session ID and Token (https://tokbox.com/account/)
  1. Add your Chrome Extension ID (https://tokbox.com/developer/guides/screen-sharing/js/)
1. `cd ..`
1. `yarn` (or `npm install`)
1. `npm run example`
1. Visit `http://localhost:8000` in your browser

Refer to the `App.js`, `Publisher.js` and `Subscriber.js` files in `example/components/` for library usage.

## Usage

The following sections explains how to import and use `opentok-react` in your React application.

### Importing opentok-react

Import the `opentok-react` components into your React application:

```js
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';
```

Or `require` it if you need to use CommonJS modules:

```js
const { OTSession, OTPublisher, OTStreams, OTSubscriber } = require('opentok-react');
```

### Example with OTSession Component

```js
class MyApp extends React.Component {
  render() {
    return (
      <OTSession apiKey="your-api-key" sessionId="your-session-id" token="your-session-token">
        <OTPublisher />
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    );
  }
}
```

### Example with createSession Helper

```js
class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { streams: [] };
  }

  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: 'your-api-key',
      sessionId: 'your-session-id',
      token: 'your-session-token',
      onStreamsUpdated: streams => { this.setState({ streams }); }
    });
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

  render() {
    return (
      <div>
        <OTPublisher session={this.sessionHelper.session} />

        {this.state.streams.map(stream => {
          return (
            <OTSubscriber
              key={stream.id}
              session={this.sessionHelper.session}
              stream={stream}
            />
          );
        })}
      </div>
    );
  }
}
```

## API Reference

The `opentok-react` library comprises of:

- `OTSession` Component
- `OTPublisher` Component
- `OTStreams` Component
- `OTSubscriber` Component
- `createSession` Helper
- `preloadScript` Higher-Order Component

### OTSession Component

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| apiKey | String | Yes | TokBox API Key
| sessionId | String | Yes | TokBox Session ID
| token | String | Yes | TokBox token
| eventHandlers | Object&lt;Function&gt; | No | Event handlers passed into [session.on](https://tokbox.com/developer/sdks/js/reference/Session.html#on)
| onConnect | Function() | No | Invoked when [session.connect](https://tokbox.com/developer/sdks/js/reference/Session.html#connect) successfully completes
| onError | Function(err) | No | Invoked when [session.connect](https://tokbox.com/developer/sdks/js/reference/Session.html#connect) fails

The `OTSession` component manages the connection to an OpenTok [Session](https://tokbox.com/developer/sdks/js/reference/Session.html). It passes the Session instance as the `session` prop to its child components. It is recommended that you nest `OTPublisher` and `OTStreams` inside `OTSession`:

```html
<OTSession apiKey="your-api-key" sessionId="your-session-id" token="your-session-token">
  <OTPublisher />
  <OTStreams>
    <OTSubscriber />
  </OTStreams>
</OTSession>
```

### OTPublisher Component

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| session | [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) | No | OpenTok Session instance. This is auto populated by wrapping `OTPublisher` with `OTSession`
| properties | Object | No | Properties passed into [OT.initPublisher](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher)
| eventHandlers | Object&lt;Function&gt; | No | Event handlers passed into [publisher.on](https://tokbox.com/developer/sdks/js/reference/Publisher.html#on)
| onInit | Function() | No | Invoked when [OT.initPublisher](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher) successfully completes
| onPublish | Function() | No | Invoked when [session.publish](https://tokbox.com/developer/sdks/js/reference/Session.html#publish) successfully completes
| onError | Function(err) | No | Invoked when either [OT.initPublisher](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher) or [session.publish](https://tokbox.com/developer/sdks/js/reference/Session.html#publish) fail

The `OTPublisher` component will initialise a publisher and publish to a specified session upon mounting. It will also ensure the Publisher video element is attached to the DOM inside the component rather than appending to the body (which is the Publisher's default behaviour).

```html
<OTSession apiKey="your-api-key" sessionId="your-session-id" token="your-session-token">
  <OTPublisher />
</OTSession>
```

If you are not using `OTSession` then you must specify a [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) object using the `session` prop.

```html
<OTPublisher session={this.sessionHelper.session} />
```

Use the `properties` prop to specify a properties object for [OT.initPublisher](https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher) and the `eventHandlers` prop to specify an object of event handlers for [Publisher#on](https://tokbox.com/developer/sdks/js/reference/Publisher.html#on).

```js
class MyApp extends React.Component {
  constructor(props) {
    super(props);

    this.publisherProperties = {
      audioFallbackEnabled: false,
      showControls: false
    };

    this.publisherEventHandlers = {
      streamCreated: event => {
        console.log('Publisher stream created!');
      },
      streamDestroyed: event => {
        console.log('Publisher stream destroyed!');
      }
    };
  }

  render() {
    return (
      <OTSession apiKey="your-api-key" sessionId="your-session-id" token="your-session-token">
        <OTPublisher
          properties={this.publisherProperties}
          eventHandlers={this.publisherEventHandlers}
        />
      </OTSession>
    );
  }
}
```

The `properties` prop is used for initial set up of the Publisher and making changes to it will not update the Publisher, you will instead need to invoke Publisher methods. To facilitate this the Publisher instance is exposed via the `getPublisher()` component method. You should always call this method to get the latest Publisher instance instead of keeping a reference to it as it's possible for the Publisher instance to change, leaving you with a stale reference.

However, for convenience the `OTPublisher` does watch for changes on a few keys of the `properties` object and makes the necessary changes. Currently these are:

| Publisher Property | Action |
| --- | --- |
| videoSource | Destroys and recreates the Publisher with the new video source. This is the only way to change the video source of a Publisher. This is used in the example application to allow the user to toggle between publishing their camera and publishing their screen |
| publishAudio | Calls [publisher.publishAudio()](https://tokbox.com/developer/sdks/js/reference/Publisher.html#publishAudio) to toggle audio on and off |
| publishVideo | Calls [publisher.publishVideo()](https://tokbox.com/developer/sdks/js/reference/Publisher.html#publishVideo) to toggle video on and off |

There are plans to support more Publisher properties but for now you will have to call `getPublisher()` to retrieve the Publisher instance and make the necessary changes yourself.

### OTStreams Component

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| children | ReactElement | Yes | Must have a single child component that accepts `session` and `stream` props, eg. `OTSubscriber`
| session | [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) | Yes | OpenTok Session instance. This is auto populated by wrapping `OTStreams` with `OTSession`
| streams | Array&lt;[Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html)&gt; | No | Array of OpenTok Stream instances. This is auto populated by wrapping `OTStreams` with `OTSession`

### OTSubscriber Component

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| session | [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) | No | OpenTok Session instance. This is auto populated by wrapping `OTSubscriber` with `OTStreams`
| stream | [Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html) | No | OpenTok Stream instance. This is auto populated by wrapping `OTSubscriber` with `OTStreams`
| properties | Object | No | Properties passed into `session.subscribe`
| eventHandlers | Object&lt;Function&gt; | No | Event handlers passed into `subscriber.on`
| onSubscribe | Function() | No | Invoked when `session.subscribe` successfully completes
| onError | Function(err) | No | Invoked when `session.subscribe` fails

The `OTSubscriber` component will subscribe to a specified stream from a specified session upon mounting. It will also ensure the Subscriber video element is attached to the DOM inside the component rather than appending to the body (which is the Subscriber's default behaviour).

```html
<OTStreams>
  <OTSubscriber />
</OTStreams>
```

If you are not using `OTStreams` then you must provide a [Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html) object using the `stream` prop and a [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) object using the `session` prop.

```js
{this.sessionHelper.streams.map(stream => (
  <OTSubscriber
    key={stream.id}
    session={this.sessionHelper.session}
    stream={stream}
  />
))}
```

Use the `properties` prop to specify a properties object for [session.subscribe](https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe) and the `eventHandlers` prop to specify an object of event handlers for [Subscriber#on](https://tokbox.com/developer/sdks/js/reference/Subscriber.html#on).

```js
class MyApp extends React.Component {
  constructor(props) {
    super(props);

    this.subscriberProperties = {
      preferredFrameRate: 15,
      showControls: false
    };

    this.subscriberEventHandlers = {
      videoDisabled: event => {
        console.log('Subscriber video disabled!');
      },
      videoEnabled: event => {
        console.log('Subscriber video enabled!');
      }
    };
  }

  render() {
    return (
      <OTSession apiKey="your-api-key" sessionId="your-session-id" token="your-session-token">
        <OTStreams>
          <OTSubscriber
            properties={this.subscriberProperties}
            eventHandlers={this.subscriberEventHandlers}
          />
        </OTStreams>
      </OTSession>
    );
  }
}
```

The `properties` prop is used for initial set up of the Subscriber and making changes to it will not update the Subscriber, you will instead need to invoke Subscriber methods. To facilitate this the Subscriber instance is exposed via the `getSubscriber()` component method. You should always call this method to get the latest Subscriber instance instead of keeping a reference to it as it's possible for the Subscriber instance to change, leaving you with a stale reference.

However, for convenience the `OTSubscriber` does watch for changes on a few keys of the `properties` object and makes the necessary changes. Currently these are:

| Subscriber Property | Action |
| --- | --- |
| subscribeToAudio | Calls [subscriber.subscribeToAudio()](https://tokbox.com/developer/sdks/js/reference/Subscriber.html#subscribeToAudio) to toggle audio on and off |
| subscribeToVideo | Calls [subscriber.subscribeToVideo()](https://tokbox.com/developer/sdks/js/reference/Subscriber.html#subscribeToVideo) to toggle video on and off |

There are plans to support more Subscriber properties but for now you will have to call `getSubscriber()` to retrieve the Subscriber instance and make the necessary changes yourself.

### createSession Helper

The `createSession` helper has been provided to easily create a session and monitor the current list of subscriber streams.

```js
class MyApp extends React.Component {
  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: 'your-api-key',
      sessionId: 'your-session-id',
      token: 'your-session-token',
      onStreamsUpdated: streams => {
        console.log('Current subscriber streams:', streams);
      }
    });
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }
}
```

The `createSession` helper returns an object with the following properties:

- `session` - The [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) instance.
- `streams` - An up-to-date array of [Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html) instances.
- `disconnect` - A clean up function. Call this when your component unmounts.

Use of this helper is optional and you can instead use the `OTSession` component or directly call [OT.initSession](https://tokbox.com/developer/sdks/js/reference/OT.html#initSession) and listen to [streamCreated](https://tokbox.com/developer/sdks/js/reference/Session.html#event:streamCreated) events if you prefer.


### `preloadScript` Higher-Order Component

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| opentokClientUrl | String | No | The URL of the OpenTok client script to load. It defaults to `https://static.opentok.com/v2/js/opentok.min.js`.
| loadingDelegate | ReactElement | No | An element that will be displayed while the OpenTok client script is loading. It defaults to an empty `<div />`.

In larger applications, one might not want to load the `opentok.js` client with a `<script>` tag all the time. The `preloadScript` higher-order component will do this for you at the appropriate time.

For example, imagine you have a React Router application with the following route structure:

```html
<Router>
  <Route path="/">
    <IndexRoute component="..." />
    <Route path="something" component="..." />
    <Route path="video" component={VideoChat} />
    <Route path="something-else" component="..." />
  </Route>
</Router>
```

What you'd like to do is delay the loading of `opentok.js` until the `VideoChat` component is being used. Here's how you can do this:

```javascript
class VideoChat extends React.Component {
  // All the code of your component
}

export default preloadScript(App);
```

## Custom Build

1. `git clone https://github.com/opentok/opentok-react.git`
1. `cd opentok-react/`
1. `yarn` (or `npm install`)
1. Modify code in `src/`
1. `npm run build`
1. Check that files in `dist/` have been updated.

## Contributing

If you make changes to the project that you would like to contribute back then please follow the [contributing guidelines](CONTRIBUTING.md). All contributions are greatly appreciated!

## Tests

Run the unit tests locally with the following command:

```
npm run unit
```

By default this will launch the Chrome browser. To run tests in Firefox use:

```
npm run unit -- --browsers Firefox
```

Run the linter with:

```
npm run lint
```

The unit tests are automatically run on [Travis](https://travis-ci.org/opentok/opentok-react) on both Chrome and Firefox and the current build status is shown at the top of this document.

## About

Originally authored by [Aiham Hammami](https://github.com/aiham).
Currently maintained by [TokBox Inc.](https://tokbox.com/).
