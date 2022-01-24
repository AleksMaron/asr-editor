import React, { Component } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";


function isCurrentWord(currentTime, start, end) {
  if ((currentTime >= start) && (currentTime <= end)) {
    return true;
  } else {
    return false;
  }
}

function confidenceColor(confidence) {
  const confNumber = parseFloat(confidence);
  if (confNumber >= 0.9) {
    return {backgroundColor: "green"};
  } else if (confNumber < 0.9 && confNumber >= 0.7) {
    return {backgroundColor: "yellow"};
  } else {
    return {backgroundColor: "red"};
  }

}

class Word extends Component {
  text = this.props.block.get("text");
  data = this.props.block.get("data");
  start = this.data.get("start");
  end = this.data.get("end");
  confidence = this.data.get("confidence");
  
  shouldComponentUpdate(nextProps) {
    const isNextWord = isCurrentWord(nextProps.currentTime, this.start, this.end);
    const isNowCurrentWord = isCurrentWord(this.props.currentTime, this.start, this.end);

    if ((isNextWord && !isNowCurrentWord) || (isNowCurrentWord && !isNextWord)) {
      return true;
    }
    
    return false;
  }

  render() {
    if (isCurrentWord(this.props.currentTime, this.start, this.end))
    {
      const confidenceClass = confidenceColor(this.confidence);
      return(
        <Text style={confidenceClass}>
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
