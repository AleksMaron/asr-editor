import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import convertToSMPTE from '../media-card/convertToSMPTE';
import { connect } from 'react-redux';

function getStyle(confidence) {
  const confNumber = parseFloat(confidence);
  if (confNumber >= 0.9) {
    return {
      color: '#7FFF00',
    };
  } else if (confNumber < 0.9 && confNumber >= 0.7) {
    return {
      color: 'orange',
    };
  } else {
    return {
      color: 'red',
    };
  }
}

function Word(props) {
  const block  = props.contentState.getBlockForKey(props.blockKey);
  const data = block.getData();
  const confidence = data.get('confidence');
  const startSMPTE = convertToSMPTE(parseFloat(data.get('start')), props.frameRate);
  const endSMPTE = convertToSMPTE(parseFloat(data.get('end')), props.frameRate);
  const dataString = startSMPTE + ' | ' + (confidence ? confidence : '1.0') + ' | ' + endSMPTE;
  if (confidence) {
    return(
      <Tooltip title={dataString} placement='top' arrow style={{fontWeight: 'bold', backgroundColor: 'red'}}>
        <span style={getStyle(confidence)}>
          {props.children}
        </span>
      </Tooltip>
    );
  }

  return(
    <span style={getStyle('1.0')}>
      {props.children}
    </span>
  );
}

function mapStateToProps(state) {
  return {
    frameRate: state.media.frameRate
  };
}

export default connect(mapStateToProps)(Word);

