import React, { Component } from "react";
import { connect } from "react-redux";

import {
    Player,
    ControlBar,
    ReplayControl,
    ForwardControl,
    CurrentTimeDisplay,
    TimeDivider,
    PlaybackRateMenuButton,
    VolumeMenuButton,
    BigPlayButton
  } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";

import { updateCurrentTime, wordClicked } from "./mediaActions";

const compensationTime = 0.1;

class MediaCard extends Component {
  
  componentDidMount() {
    //Inject currentTime from localStorage to the Player
    this.player.seek(this.props.currentTime);
    // subscribe for player state change
    this.player.subscribeToStateChange(this.dispatchCurrentTime.bind(this))
  }

  dispatchCurrentTime = () => {
    // update currentTime of the global state from player state
    const { player } = this.player.getState();
    const currentTimeCompensated = player.currentTime + compensationTime;
    let currentWord;

    for (let word of this.props.timecodes) {
      if((currentTimeCompensated >= parseFloat(word.start)) && (currentTimeCompensated < parseFloat(word.end))) {
        currentWord = word.start;
        break;
      }
    }

    if (currentWord && (currentWord !== this.props.currentTime)) {
      this.props.updateCurrentTime(currentWord);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.playOrPause !== this.props.playOrPause) {
      if (nextProps.playOrPause) {
        this.player.actions.play();
      } else {
        this.player.actions.pause();
      }

      return false;
    }

    if (nextProps.wordClickedTime !== this.props.wordClickedTime) {
      this.player.seek(parseFloat(nextProps.wordClickedTime));
      // this.props.wordClicked(false);
      return false;
    }

    return true;
  }

  render() {
    return(
      <Player       
      ref={player => {this.player = player}}
      src={this.props.source}
      >
        <BigPlayButton position="center" />
        <ControlBar>
          <ReplayControl seconds={10} order={1.1} />
          <ForwardControl seconds={30} order={1.2} />
          <CurrentTimeDisplay order={4.1} />
          <TimeDivider order={4.2} />
          <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
          <VolumeMenuButton disabled />
        </ControlBar>
      </Player>
    )
  }
}

// Connecting the conponent to the redux state
function mapStateToProps(state) {
  return {
    source: state.media.source,
    currentTime: state.media.currentTime,
    wordClickedTime: state.media.wordClickedTime,
    timecodes: state.text.timecodes,
    playOrPause: state.media.playOrPause
  };
}

export default connect(mapStateToProps, {updateCurrentTime, wordClicked})(MediaCard);