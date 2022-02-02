import React, { Component } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";

import { EditorBlock } from "draft-js";

import { updateCurrentTime } from "../media-card/mediaActions";
import "./TextEditor.css";

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
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  
  shouldComponentUpdate(nextProps) {
    const { block } = this.props;
    const data = block.getData();
    const start = data.get("start");
    const end = data.get("end");
    const text = block.getText(); 

    const isNextWord = isCurrentWord(nextProps.currentTime, start, end);
    const isNowCurrentWord = isCurrentWord(this.props.currentTime, start, end);
    const newText = nextProps.block.getText();

    if ((isNextWord && !isNowCurrentWord) || 
        (isNowCurrentWord && !isNextWord) || 
        (text !== newText)) {
      return true;
    }
    
    return false;
  }

  onClick() {
    const { block } = this.props;
    const start = block.getData().get("start");
    this.props.updateCurrentTime(start);
  }

  render() {
    const { block, contentState } = this.props;
    const text = block.getText(); 
    const data = block.getData();
    const start = data.get("start");
    const end = data.get("end");
    const confidence = data.get("confidence");

    if (isCurrentWord(this.props.currentTime, start, end))
    {
      const confidenceClass = confidenceColor(confidence);
      return(
        <Text style={confidenceClass}>
          <b>{text}</b>
        </Text>
      );
    } else {
      return(
        // <EditorBlock {...this.props} />
        <Text onClick={this.onClick}> {text} </Text>
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

export default connect(mapStateToProps, {updateCurrentTime})(Word);
