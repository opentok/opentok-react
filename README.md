# opentok-react

[![npm version](https://badge.fury.io/js/opentok-react.svg)](https://badge.fury.io/js/opentok-react) [![Build Status](https://travis-ci.org/aiham/opentok-react.svg?branch=master)](https://travis-ci.org/aiham/opentok-react)

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
- [Custom Build](#custom-build)
- [Tests](#tests)

## Pre-Requisites

1. NodeJS
1. Register a TokBox account: https://tokbox.com/account/user/signup
1. Include `opentok.js` before your application:
```html
<script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
```

## Install

Add `opentok-react` as a dependency of your application:

```sh
npm install --save opentok-react
```

## Example App

There is an example application provided in `example/` and you can run it with the following steps:

1. `git clone https://github.com/aiham/opentok-react.git`
1. `cd opentok-react/example/`
1. `cp config.template.js config.js`
1. Edit `config.js`:
  1. Add your OpenTok API key, Session ID and Token (https://tokbox.com/account/)
  1. Add your Chrome Extension ID (https://tokbox.com/developer/guides/screen-sharing/js/)
1. `npm install`
1. `npm run example`
1. Visit `http://localhost:8000` in your browser

Refer to the `App.js`, `Publisher.js` and `Subscriber.js` files in `example/components/` for library usage.

## Usage

The following sections explains how to import and use `opentok-react` in your React application.

### Importing opentok-react

Import the `opentok-react` components into your React application:

```js
import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';
```

Or `require` it if you need to use CommonJS modules:

```js
var otReact = require('opentok-react');

var OTSession = otReact.OTSession;
var OTPublisher = otReact.OTPublisher;
var OTStreams = otReact.OTStreams;
var OTSubscriber = otReact.OTSubscriber;
var createSession = otReact.createSession;
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

The `opentok-react` library is comprised of:

- `OTSession` Component
- `OTPublisher` Component
- `OTStreams` Component
- `OTSubscriber` Component
- `createSession` Helper

### OTSession Component

TODO

### OTPublisher Component

The `OTPublisher` component will initialise a publisher and publish to a specified session upon mounting. You must specify a [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) object using the `session` prop.

```js
class MyApp extends React.Component {
  render() {
    return (
      <OTPublisher session={this.sessionHelper.session} />
    );
  }
}
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
      <OTPublisher
        session={this.sessionHelper.session}
        properties={this.publisherProperties}
        eventHandlers={this.publisherEventHandlers}
      />
    );
  }
}
```

#### TODO
- Describe `getPublisher()` method.
- Explain which properties `OTPublisher` will monitor for changes.
- Explain that this component will not cause publisher to be appended to body.

### OTStreams Component

TODO

### OTSubscriber Component

The `OTSubscriber` component will subscribe to a specified stream from a specified session upon mounting. You must provide a [Stream](https://tokbox.com/developer/sdks/js/reference/Stream.html) object using the `stream` prop and a [Session](https://tokbox.com/developer/sdks/js/reference/Session.html) object using the `session` prop.

```js
class MyApp extends React.Component {
  render() {
    return (
      <div>
        {this.sessionHelper.streams.map(stream => {
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

#### TODO
- Describe `getSubscriber()` method.
- Describe `properties` prop.
- Describe `eventHandlers` prop.
- Explain which properties `OTPublisher` will monitor for changes.
- Explain that this component will not cause subscriber to be appended to body.

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

## Custom Build

1. `git clone https://github.com/aiham/opentok-react.git`
1. `cd opentok-react/`
1. `npm install`
1. Modify code in `src/`
1. `npm run build`
1. Check that files in `dist/` have been updated.

## Tests

Run the unit tests locally with the following command:

```
npm run unit
```

By default this will launch the Chrome browser. To run tests in Firefox use:

```
npm run unit -- --browsers Firefox
```

The unit tests are automatically run on [Travis](https://travis-ci.org/aiham/opentok-react) on both Chrome and Firefox and the current build status is shown at the top of this document.
