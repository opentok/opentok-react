import React, { Component } from 'react';

import { OTPublisher } from '../../src'
import RadioButtons from './RadioButtons';
import CheckBox from './CheckBox';

export default class Publisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: true,
      video: true,
      videoSource: 'camera'
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  setVideoSource = (videoSource) => {
    this.setState({ videoSource });
  }

  render() {
    return (
      <div>
        <OTPublisher
          session={this.props.session}
          properties={{
            publishAudio: this.state.audio,
            publishVideo: this.state.video,
            videoSource: this.state.videoSource === 'screen' ? 'screen' : undefined
          }}
        />
        <RadioButtons
          buttons={[
            {
              label: 'Camera',
              value: 'camera'
            },
            {
              label: 'Screen',
              value: 'screen'
            }
          ]}
          initialChecked={this.state.videoSource}
          onChange={this.setVideoSource}
        />
        <CheckBox
          label="Publish Audio"
          initialChecked={this.state.audio}
          onChange={this.setAudio}
        />
        <CheckBox
          label="Publish Video"
          initialChecked={this.state.video}
          onChange={this.setVideo}
        />
      </div>
    );
  }
}
