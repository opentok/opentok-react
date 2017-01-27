import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class OTSubscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriber: null
    };
  }

  createSubscriber() {
    this.destroySubscriber();

    if (!this.props.session || !this.props.stream) {
      return;
    }

    let container = document.createElement('div');
    container.setAttribute('class', 'OTSubscriberContainer');
    findDOMNode(this).appendChild(container);

    let subscriber = this.props.session.subscribe(
      this.props.stream,
      container,
      this.props.properties,
      err => {
        if (err) {
          console.error('Failed to publish to OpenTok session:', err);
        }
      }
    );

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      subscriber.on(this.props.eventHandlers);
    }

    this.setState({ subscriber });
  }

  destroySubscriber(session) {
    if (!session) {
      session = this.props.session;
    }

    if (this.state.subscriber) {
      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.state.subscriber.once('destroyed', () => {
          this.state.subscriber.off(this.props.eventHandlers);
        });
      }

      if (session) {
        session.unsubscribe(this.state.subscriber);
      }
    }
  }

  getSubscriber() {
    return this.state.subscriber;
  }

  componentDidMount() {
    this.createSubscriber();
  }

  componentDidUpdate(prevProps, prevState) {
    let cast = (value, Type, defaultValue) => {
      return value === undefined ? defaultValue : Type(value);
    };

    let updateSubscriberProperty = key => {
      let previous = cast(prevProps.properties[key], Boolean, true);
      let current = cast(this.props.properties[key], Boolean, true);
      if (previous !== current) {
        this.state.subscriber[key](current);
      }
    };

    updateSubscriberProperty('subscribeToAudio');
    updateSubscriberProperty('subscribeToVideo');

    if (
      (!prevProps.session || !prevProps.stream) &&
      this.props.session && this.props.stream
    ) {
      this.createSubscriber();
    } else if (
      prevProps.session && prevProps.stream &&
      (!this.props.session || !this.props.stream)
    ) {
      this.destroySubscriber(prevProps.session);
    }
  }

  componentWillUnmount() {
    this.destroySubscriber();
  }

  render() {
    return <div className='OTSubscriber' />;
  }
}

OTSubscriber.propTypes = {
  stream: PropTypes.object,
  session: PropTypes.object,
  properties: PropTypes.object,
  eventHandlers: PropTypes.objectOf(PropTypes.func)
};

OTSubscriber.defaultProps = {
  properties: {}
};
