import React, { Component, PropTypes } from 'react';

export default class OTSubscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriber: null,
    };
  }

  componentDidMount() {
    this.createSubscriber();
  }

  componentDidUpdate(prevProps) {
    const cast = (value, Type, defaultValue) => (value === undefined ? defaultValue : Type(value));

    const updateSubscriberProperty = (key) => {
      const previous = cast(prevProps.properties[key], Boolean, true);
      const current = cast(this.props.properties[key], Boolean, true);
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

  getSubscriber() {
    return this.state.subscriber;
  }

  createSubscriber() {
    this.destroySubscriber();

    if (!this.props.session || !this.props.stream) {
      return;
    }

    const container = document.createElement('div');
    container.setAttribute('class', 'OTSubscriberContainer');
    this.node.appendChild(container);

    const subscriber = this.props.session.subscribe(
      this.props.stream,
      container,
      this.props.properties,
      (err) => {
        if (err) {
          console.error('Failed to publish to OpenTok session:', err);
        }
      },
    );

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      subscriber.on(this.props.eventHandlers);
    }

    this.setState({ subscriber });
  }

  destroySubscriber(session = this.props.session) {
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

  render() {
    return <div ref={node => (this.node = node)} />;
  }
}

OTSubscriber.propTypes = {
  stream: PropTypes.shape({
    streamId: PropTypes.string,
  }),
  session: PropTypes.shape({
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  }),
  properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: PropTypes.objectOf(PropTypes.func),
};

OTSubscriber.defaultProps = {
  stream: null,
  session: null,
  properties: {},
  eventHandlers: null,
};
