import React, { Component, PropTypes } from 'react';

export default class OTPublisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publisher: null,
      lastStreamId: '',
    };
  }

  componentDidMount() {
    this.createPublisher();
  }

  componentDidUpdate(prevProps) {
    const useDefault = (value, defaultValue) => (value === undefined ? defaultValue : value);

    const shouldUpdate = (key, defaultValue) => {
      const previous = useDefault(prevProps.properties[key], defaultValue);
      const current = useDefault(this.props.properties[key], defaultValue);
      return previous !== current;
    };

    const updatePublisherProperty = (key, defaultValue) => {
      if (shouldUpdate(key, defaultValue)) {
        const value = useDefault(this.props.properties[key], defaultValue);
        this.state.publisher[key](value);
      }
    };

    if (shouldUpdate('videoSource', undefined)) {
      this.createPublisher();
      return;
    }

    updatePublisherProperty('publishAudio', true);
    updatePublisherProperty('publishVideo', true);

    if (!prevProps.session && this.props.session) {
      this.createPublisher();
    } else if (prevProps.session && !this.props.session) {
      this.destroyPublisher(prevProps.session);
    }
  }

  componentWillUnmount() {
    if (this.props.session) {
      this.props.session.off('sessionConnected', this.sessionConnectedHandler);
    }

    this.destroyPublisher();
  }

  getPublisher() {
    return this.state.publisher;
  }

  destroyPublisher(session = this.props.session) {
    if (this.state.publisher) {
      this.state.publisher.off('streamCreated', this.streamCreatedHandler);

      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.state.publisher.once('destroyed', () => {
          this.state.publisher.off(this.props.eventHandlers);
        });
      }

      if (session) {
        session.unpublish(this.state.publisher);
      }
      this.state.publisher.destroy();
    }
  }

  publishToSession(publisher) {
    this.props.session.publish(publisher, (err) => {
      if (err) {
        console.error('Failed to publish to OpenTok session:', err);
      }
    });
  }

  createPublisher() {
    this.destroyPublisher();

    if (!this.props.session) {
      return;
    }

    const properties = this.props.properties || {};
    let container;

    if (properties.insertDefaultUI !== false) {
      container = document.createElement('div');
      container.setAttribute('class', 'OTPublisherContainer');
      this.node.appendChild(container);
    }

    const publisher = OT.initPublisher(container, properties);
    publisher.on('streamCreated', this.streamCreatedHandler);

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      publisher.on(this.props.eventHandlers);
    }

    if (this.props.session.connection) {
      this.publishToSession(publisher);
    } else {
      this.props.session.once('sessionConnected', this.sessionConnectedHandler);
    }

    this.setState({ publisher, lastStreamId: '' });
  }

  sessionConnectedHandler = () => {
    this.publishToSession(this.state.publisher);
  }

  streamCreatedHandler = (event) => {
    this.setState({ lastStreamId: event.stream.id });
  }

  render() {
    return <div ref={node => (this.node = node)} />;
  }
}

OTPublisher.propTypes = {
  session: PropTypes.shape({
    connection: PropTypes.shape({
      connectionId: PropTypes.string,
    }),
    once: PropTypes.func,
    off: PropTypes.func,
    publish: PropTypes.func,
    unpublish: PropTypes.func,
  }),
  properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: PropTypes.objectOf(PropTypes.func),
};

OTPublisher.defaultProps = {
  session: null,
  properties: {},
  eventHandlers: null,
};
