import React, { Component, PropTypes, Children, cloneElement } from 'react';

import createSession from './createSession';

export default class OTSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: []
    };
  }

  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: this.props.apiKey,
      sessionId: this.props.sessionId,
      token: this.props.token,
      onStreamsUpdated: streams => { this.setState({ streams }); }
    });

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      this.sessionHelper.session.on(this.props.eventHandlers);
    }
  }

  componentWillUnmount() {
    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      this.sessionHelper.session.off(this.props.eventHandlers);
    }
    this.sessionHelper.disconnect();
  }

  render() {
    const childrenWithProps = Children.map(
      this.props.children,
      child => cloneElement(
        child,
        {
          session: this.sessionHelper.session,
          streams: this.state.streams
        }
      )
    );

    return <div>{childrenWithProps}</div>;
  }
}

OTSession.propTypes = {
  apiKey: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  eventHandlers: PropTypes.objectOf(PropTypes.func)
};
