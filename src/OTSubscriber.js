import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

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

    // manage height and width properties evolution
    if (this.props.containerStyle.width && this.props.containerStyle.height) {
      const container = document.getElementById(this.containerId);
      container.style.width = this.props.containerStyle.width;
      container.style.height = this.props.containerStyle.height;
    }

    if (this.props.session !== prevProps.session || this.props.stream !== prevProps.stream) {
      this.destroySubscriber(prevProps.session);
      this.createSubscriber();
    }
  }

  componentWillUnmount() {
    this.destroySubscriber();
  }

  getSubscriber() {
    return this.state.subscriber;
  }

  createSubscriber() {
    if (!this.props.session || !this.props.stream) {
      this.setState({ subscriber: null });
      return;
    }

    this.containerId = uuid();
    const { containerId } = this;
    const container = document.createElement('div');
    container.setAttribute('class', 'OTSubscriberContainer');
    container.setAttribute('id', containerId);
    this.node.appendChild(container);

    this.subscriberId = uuid();
    const { subscriberId } = this;

    const subscriber = this.props.session.subscribe(
      this.props.stream,
      container,
      this.props.properties,
      (err) => {
        if (subscriberId !== this.subscriberId) {
          // Either this subscriber has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (err && typeof this.props.onError === 'function') {
          this.props.onError(err, this.props.stream);
        } else if (!err && typeof this.props.onSubscribe === 'function') {
          this.props.onSubscribe(this.props.stream);
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
    delete this.subscriberId;

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
  containerStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: PropTypes.objectOf(PropTypes.func),
  onSubscribe: PropTypes.func,
  onError: PropTypes.func,
};

OTSubscriber.defaultProps = {
  stream: null,
  session: null,
  properties: {},
  containerStyle: {},
  eventHandlers: null,
  onSubscribe: null,
  onError: null,
};
