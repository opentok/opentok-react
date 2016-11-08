import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class OTPublisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publisher: null,
      lastStreamId: ''
    };
  }

  streamCreatedHandler = (event) => {
    this.setState({ lastStreamId: event.stream.id });
  }

  sessionConnectedHandler = (event) => {
    this.publishToSession(this.state.publisher);
  }

  createPublisher() {
    this.destroyPublisher();

    if (!this.props.session) {
      return;
    }

    let container = document.createElement('div');
    findDOMNode(this).appendChild(container);

    let publisher = OT.initPublisher(container, this.props.properties);
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

  destroyPublisher(session) {
    if (!session) {
      session = this.props.session;
    }

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
    this.props.session.publish(publisher, err => {
      if (err) {
        console.error('Failed to publish to OpenTok session:', err);
      }
    });
  }

  getPublisher() {
    return this.state.publisher;
  }

  componentDidMount() {
    this.createPublisher();
  }

  componentDidUpdate(prevProps, prevState) {
    let useDefault = (value, defaultValue) => {
      return value === undefined ? defaultValue : value;
    };

    let shouldUpdate = (key, defaultValue) => {
      let previous = useDefault(prevProps.properties[key], defaultValue);
      let current = useDefault(this.props.properties[key], defaultValue);
      return previous !== current;
    };

    let updatePublisherProperty = (key, defaultValue) => {
      if (shouldUpdate(key, defaultValue)) {
        let value = useDefault(this.props.properties[key], defaultValue);
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

  render() {
    return <div />;
  }
}

OTPublisher.propTypes = {
  session: PropTypes.object,
  properties: PropTypes.object,
  eventHandlers: PropTypes.objectOf(PropTypes.func)
};

OTPublisher.defaultProps = {
  properties: {}
};
