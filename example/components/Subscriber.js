import React, { Component } from 'react';

import { OTSubscriber } from '../../src'
import CheckBox from './CheckBox';

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true
    };

    this.otSubscriber = null;
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  onError = (err) => {
    this.setState({ error: `Failed to subscribe: ${err.message}` });
  }

  reSubscribe = () => {
        this.otSubscriber.destroySubscriber(this.otSubscriber.state.session);
        this.otSubscriber.createSubscriber();
    }

  render() {
    return (
      <div>
        {this.state.error ? <div>{this.state.error}</div> : null}
        <OTSubscriber
          properties={{
            subscribeToAudio: this.state.audio,
            subscribeToVideo: this.state.video
          }}
          onError={this.onError}
          eventHandlers={this.props.eventHandlers}
          ref={(instance) => { this.otSubscriber = instance }}
        />
        <CheckBox
          label="Subscribe to Audio"
          initialChecked={this.state.audio}
          onChange={this.setAudio}
        />
        <CheckBox
          label="Subscribe to Video"
          initialChecked={this.state.video}
          onChange={this.setVideo}
        />
        <button onClick={this.reSubscribe} > Resubscribe </button>
      </div>
    );
  }
}
