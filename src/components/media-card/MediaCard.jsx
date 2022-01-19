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
    VolumeMenuButton
  } from 'video-react';
import "../../../node_modules/video-react/dist/video-react.css";

import { updateCurrentTime } from "./mediaActions";

class MediaCard extends Component {
  
  componentDidMount() {
    // subscribe for player state change
    this.player.subscribeToStateChange(this.dispatchCurrentTime.bind(this))
  }

  dispatchCurrentTime = () => {
    // update currentTime of the global state from player state
    const { player } = this.player.getState();

    if (player.currentTime !== this.props.currentTime) {
      this.props.updateCurrentTime(player.currentTime);
    }
  }

  render() {
    return(
      <Player       
      ref={player => {this.player = player}}
      src={this.props.source}
      >
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
  const source = state.media.source;
  const currentTime = state.media.currentTime;
  return {
    source,
    currentTime
  };
}

export default connect(mapStateToProps, {updateCurrentTime})(MediaCard);