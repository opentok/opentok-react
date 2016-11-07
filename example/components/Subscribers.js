'use strict';

import React, { Component } from 'react';

import Subscriber from './Subscriber';

export default class Subscribers extends Component {
  constructor(props) {
    super(props);

    this.renderSubscribers = this.renderSubscribers.bind(this);
  }

  renderSubscribers() {
    return this.props.streams.map(stream => {
      return (
        <Subscriber
          key={stream.id}
          session={this.props.session}
          stream={stream}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderSubscribers()}
      </div>
    );
  }
}
