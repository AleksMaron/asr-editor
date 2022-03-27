import React, { Component } from "react";
import { connect } from "react-redux";
import convertToSMPTE from "./convertToSMPTE";
import "./WordInfo.css"

function getConfidenceColor(confidence) {
  const confNumber = parseFloat(confidence);
  if (confNumber >= 0.9) {
    return "#7FFF00";
  } else if (confNumber < 0.9 && confNumber >= 0.7) {
    return "orange";
  } else {
    return "red";
  }
}

const moveUp = 40;
const componentWidth = 200;

class WordInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        left: null, 
        top: null
      },
    }
  }
  
  componentDidMount() {
    document.onselectionchange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectionDOMRect = range.getBoundingClientRect();
        const width = selectionDOMRect.width;
        const left = (width / 2 + selectionDOMRect.x) - componentWidth / 2;
        const top = selectionDOMRect.y - moveUp;
        if ((left !== this.state.coordinates.left) || (top !== this.state.coordinates.top)) {
          this.setState({coordinates: {left, top}});
        }
      }
    }
    window.onresize = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectionDOMRect = range.getBoundingClientRect();
        const width = selectionDOMRect.width;
        const left = (width / 2 + selectionDOMRect.x) - componentWidth / 2;
        const top = selectionDOMRect.y - moveUp;
        if ((left !== this.state.coordinates.left) || (top !== this.state.coordinates.top)) {
          this.setState({coordinates: {left, top}});
        }
      }
    };
  }


  render() {
    if (this.state.coordinates.left && this.state.coordinates.top) {
      const currentContent = this.props.editorState.getCurrentContent();
      const currentBlockKey = this.props.editorState.getSelection().getStartKey();
      const wordData = currentContent.getBlockForKey(currentBlockKey).getData();
  
      const confidence = wordData.get('confidence');
      const startSMPTE = convertToSMPTE(parseFloat(wordData.get('start')), this.props.frameRate);
      const endSMPTE = convertToSMPTE(parseFloat(wordData.get('end')), this.props.frameRate);
      const confidenceColor = confidence ? getConfidenceColor(confidence) : "#7FFF00";
     
      return (
        <div 
          style={{ 
            width: `${componentWidth}px`,
            textAlign: 'center',
            position: 'fixed',
            color: 'black',
            borderRadius: '25px',
            left: this.state.coordinates.left, 
            top: this.state.coordinates.top,
            fontWeight: 'bold',
            fontSize: 'small',
            backgroundColor: confidenceColor,
            zIndex: 50
          }}
        >
          <span>{startSMPTE}</span>&nbsp;| 
          <span>&nbsp;{confidence ? confidence : "1.0"}</span>&nbsp;| 
          <span>&nbsp;{endSMPTE}</span>
        </div>
      );
    } else {
      return null;
    }
  }
  
}

function mapStateToProps(state) {
  return {
    frameRate: state.media.frameRate
  };
}

export default connect(mapStateToProps)(WordInfo);

