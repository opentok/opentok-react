'use strict';

import OTPublisher from './OTPublisher'
import OTSubscriber from './OTSubscriber'

import React from 'react';

export default class OTSession extends React.Component {
  constructor(props) {
    console.log('OTSession()');
    super(props);

    this.state = {
      session: null,
      streams: []
    };

    this.streamCreatedHandler = this.streamCreatedHandler.bind(this);
    this.streamDestroyedHandler = this.streamDestroyedHandler.bind(this);
  }

  streamCreatedHandler(event) {
    console.log('OTSession.streamCreatedHandler()', event);
    this.setState({
      streams: this.state.streams.concat(event.stream)
    });
  }

  streamDestroyedHandler(event) {
    console.log('OTSession.streamDestroyedHandler()', event);
    this.setState({
      streams: this.state.streams.filter(stream => {
        return stream.id !== event.stream.id;
      })
    });
  }

  componentWillMount() {
    console.log('OTSession.componentDidMount()');
    let session = OT.initSession(this.props.apiKey, this.props.sessionId);
    session.on('streamCreated', this.streamCreatedHandler);
    session.on('streamDestroyed', this.streamDestroyedHandler);

    if (
      this.props.sessionEventHandlers &&
      typeof this.props.sessionEventHandlers === 'object'
    ) {
      session.on(this.props.sessionEventHandlers);
    }

    session.connect(this.props.token, err => {
      if (err) {
        console.error('Failed to connect to OpenTok session:', err);
        return;
      }
    });

    this.setState({ session });
  }

  componentWillUnmount() {
    console.log('OTSession.componentWillUnmount()');
    if (this.state.session) {
      this.state.session.off({
        streamCreated: this.streamCreatedHandler,
        streamDestroyed: this.streamDestroyedHandler
      });

      if (
        this.props.sessionEventHandlers &&
        typeof this.props.sessionEventHandlers === 'object'
      ) {
        this.state.session.once('sessionDisconnected', () => {
          this.state.session.off(this.props.sessionEventHandlers);
        });
      }

      this.state.session.disconnect();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.session) {
      if (
        prevProps.sessionEventHandlers &&
        typeof prevProps.sessionEventHandlers === 'object'
      ) {
        this.state.session.off(prevProps.sessionEventHandlers);
      }
      if (
        this.props.sessionEventHandlers &&
        typeof this.props.sessionEventHandlers === 'object'
      ) {
        this.state.session.on(this.props.sessionEventHandlers);
      }
    }
  }

  normaliseSubscribers(subscribers) {
    let normalisedSubscribers;
    if (typeof subscribers === 'boolean') {
      if (subscribers) {
        normalisedSubscribers = {};
      }
    } else if (subscribers && typeof subscribers === 'object') {
      normalisedSubscribers = subscribers;
    }
    return normalisedSubscribers;
  }

  normalisePublishers(publishers) {
    let normalisedPublishers;
    if (typeof publishers === 'boolean') {
      normalisedPublishers = {};
      if (publishers) {
        normalisedPublishers.default = {};
      }
    } else if (!publishers || typeof publishers !== 'object') {
      normalisedPublishers = {};
    } else {
      normalisedPublishers = publishers;
    }
    return normalisedPublishers;
  }

  renderSubscribers() {
    let subscriberOptions = this.normaliseSubscribers(this.props.subscribers),
        subscribers;

    if (subscriberOptions) {
      let SubscriberComponent = subscriberOptions.component || OTSubscriber;
      subscribers = this.state.streams.map(stream => {
        return (
          <SubscriberComponent
            key={stream.id}
            stream={stream}
            session={this.state.session}
            properties={subscriberOptions.properties}
            eventHandlers={subscriberOptions.eventHandlers}
          />
        );
      });
    }

    return subscribers;
  }

  renderPublishers() {
    let publisherOptions = this.normalisePublishers(this.props.publishers);

    let publishers = Object.keys(publisherOptions).map(key => {
      let options = publisherOptions[key],
          PublisherComponent = options.component || OTPublisher;
      return (
        <PublisherComponent
          key={key}
          session={this.state.session}
          properties={options.properties}
          eventHandlers={options.eventHandlers}
        />
      );
    });

    return publishers;
  }

  render() {
    console.log('OTSession.render()');
    return (
      <div>
        {this.renderPublishers()}
        {this.renderSubscribers()}
      </div>
    );
  }
}

OTSession.propTypes = {
  apiKey: React.PropTypes.string.isRequired,
  sessionId: React.PropTypes.string.isRequired,
  token: React.PropTypes.string.isRequired,
  publishers: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.objectOf(React.PropTypes.shape({
      component: React.PropTypes.func,
      properties: React.PropTypes.object,
      eventHandlers: React.PropTypes.objectOf(React.PropTypes.func)
    }))
  ]),
  subscribers: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.shape({
      component: React.PropTypes.func,
      properties: React.PropTypes.object,
      eventHandlers: React.PropTypes.objectOf(React.PropTypes.func)
    })
  ]),
  sessionEventHandlers: React.PropTypes.objectOf(React.PropTypes.func)
};

OTSession.defaultProps = {
  publishers: true,
  subscribers: true,
  sessionEventHandlers: null
};
