import React, { Component, useState } from "react";
import { Text } from "react-native";
import { connect, useSelector } from "react-redux";

class Word extends Component {
  constructor(props) {
    super(props);
    // this.video = document.querySelector('video');
    this.text = this.props.block.get("text");
    this.data = this.props.block.get("data");
    this.start = this.data.get("start");
    this.end = this.data.get("end");
  }
  
  render() {
    
    if ((this.props.currentTime >= this.start) && (this.props.currentTime <= this.end))
    {
      return(
        <Text>
          <b>{this.text}</b>
        </Text>
      );
    } else {
      return(
        <Text>{this.text}</Text>
      );
    }
    
  }
}

function mapStateToProps(state) {
  const currentTime = state.media.currentTime;
  return {
    currentTime
  };
}
export default connect(mapStateToProps)(Word);



// function Word(props) {

//   return(
//     <Text>{props.children}</Text>
//   );
// }

// export default Word;