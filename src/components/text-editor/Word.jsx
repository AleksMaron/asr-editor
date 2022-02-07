import React, { Component } from "react";
import { connect } from "react-redux";

import { EditorBlock, CharacterMetadata } from "draft-js";

import { wordClicked } from "../media-card/mediaActions";
import "./TextEditor.css";

function isCurrentWord(currentTime, start, end) {
  if ((currentTime >= start) && (currentTime <= end)) {
    return true;
  } else {
    return false;
  }
}

function getStyle(confidence) {
  const confNumber = parseFloat(confidence);
  if (confNumber >= 0.9) {
    return "HIGH_CONF";
  } else if (confNumber < 0.9 && confNumber >= 0.7) {
    return "MEDIUM_CONF";
  } else {
    return "LOW_CONF";
  }
}

class Word extends Component {
  constructor(props) {
    super(props);
    const { block } = this.props;
    this.data = block.getData();
    this.start = this.data.get("start");
    this.end = this.data.get("end");
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { block } = this.props;
    const text = block.getText(); 
    const isNextWord = isCurrentWord(nextProps.currentTime, this.start, this.end);
    const isNowCurrentWord = isCurrentWord(this.props.currentTime, this.start, this.end);
    const newText = nextProps.block.getText();

    if ((isNextWord && !isNowCurrentWord) || 
        (isNowCurrentWord && !isNextWord) || 
        (text !== newText)) {
      return true;
    }
    
    return false;
  }

  onClick = (e) => {
    this.props.wordClicked(this.start);    
  }

  render() {
    let { block } = this.props;

    if (isCurrentWord(this.props.currentTime, this.start, this.end)) {
      const confidence = this.data.get("confidence");
      let characterList = block.getCharacterList();
      const confStyle = getStyle(confidence);

      for (let i = 0; i < characterList.size; i++) {
        let metadata = characterList.get(i);
        metadata = CharacterMetadata.applyStyle(metadata, confStyle);
        characterList = characterList.set(i, metadata);
      }
      block = block.set('characterList', characterList);
      const propsWithNewBlock = {...this.props, block: block};

      return(
        <span>
          <EditorBlock {...propsWithNewBlock} />
        </span>
      );
    } else {
      return(
        <span onClick={this.onClick}>
          <EditorBlock {...this.props} />
        </span>
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

export default connect(mapStateToProps, {wordClicked})(Word);
