import React, { Component } from 'react';

import { OTPublisher } from '../../src'
import RadioButtons from './RadioButtons';
import CheckBox from './CheckBox';

export default class Publisher extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            error: null,
            audio: true,
            video: true,
            videoSource: 'camera'
        };
        this.otPublisher = null;
    }

    setAudio = ( audio ) => {
        this.setState( { audio } );
    }

    setVideo = ( video ) => {
        this.setState( { video } );
    }

    setVideoSource = ( videoSource ) => {
        this.setState( { videoSource } );
    }

    onError = ( err ) => {
        this.setState( { error: `Failed to publish: ${err.message}` } );
    }

    rePublish = () => {
        this.otPublisher.destroyPublisher();
        this.otPublisher.createPublisher();
    }

    render () {
        return (
            <div>
                {this.state.error ? <div>{this.state.error}</div> : null}
                <OTPublisher
                    properties={{
                        publishAudio: this.state.audio,
                        publishVideo: this.state.video,
                        videoSource: this.state.videoSource === 'screen' ? 'screen' : undefined
                    }}
                    onError={this.onError}
                    eventHandlers={this.props.eventHandlers}
                    ref={(instance) => { this.otPublisher = instance }}
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
                <button onClick={this.rePublish} > Republish </button>
            </div>
        );
    }
}
