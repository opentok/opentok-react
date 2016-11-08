import React, { Component } from 'react';

import { OTSubscriber } from '../../src'
import CheckBox from './CheckBox';

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: true,
      video: true
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  render() {
    return (
      <div>
        <OTSubscriber
          session={this.props.session}
          stream={this.props.stream}
          properties={{
            subscribeToAudio: this.state.audio,
            subscribeToVideo: this.state.video
          }}
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
      </div>
    );
  }
}
