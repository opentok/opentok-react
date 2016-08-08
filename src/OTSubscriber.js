'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';

export default class OTSubscriber extends React.Component {
  constructor(props) {
    console.log('OTSubscriber()');
    super(props);

    this.state = {
      subscriber: null
    };

    this.videoElementCreatedHandler = this.videoElementCreatedHandler.bind(this);
  }

  videoElementCreatedHandler(event) {
    console.log('OTSubscriber.videoElementCreatedHandler()', event);
    ReactDOM.findDOMNode(this).appendChild(event.element);
  }

  componentDidMount() {
    console.log('OTSubscriber.componentDidMount()');
    let properties = lodash.assign(
      {},
      this.props.properties,
      { insertDefaultUI: false }
    );
    let subscriber = this.props.session.subscribe(
      this.props.stream,
      properties,
      err => {
        console.log('Subscribe callback', err);
        if (err) {
          console.error('Failed to publish to OpenTok session:', err);
        }
      }
    );
    subscriber.on('videoElementCreated', this.videoElementCreatedHandler);

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      subscriber.on(this.props.eventHandlers);
    }

    this.setState({ subscriber });
  }

  componentWillUnmount() {
    console.log('OTSubscriber.componentWillUnmount()');
    if (this.state.subscriber) {
      this.state.subscriber.off({
        videoElementCreated: this.videoElementCreatedHandler
      });

      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.state.subscriber.once('destroyed', () => {
          this.state.subscriber.off(this.props.eventHandlers);
        });
      }

      this.props.session.unsubscribe(this.state.subscriber);
    }
  }

  render() {
    console.log('OTSubscriber.render()');
    return (<div><h3>Subscriber {this.props.stream.id}</h3></div>);
  }
}

OTSubscriber.propTypes = {
  stream: React.PropTypes.object.isRequired,
  session: React.PropTypes.object.isRequired,
  properties: React.PropTypes.object,
  eventHandlers: React.PropTypes.objectOf(React.PropTypes.func)
};

OTSubscriber.defaultProps = {
  properties: {}
};
