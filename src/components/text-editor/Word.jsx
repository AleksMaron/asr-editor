import React from "react";

function getStyle(confidence) {
  const confNumber = parseFloat(confidence);
  if (confNumber >= 0.9) {
    return {
      color: "#7FFF00",
    };
  } else if (confNumber < 0.9 && confNumber >= 0.7) {
    return {
      color: "orange",
    };
  } else {
    return {
      color: "red",
    };
  }
}

function Word(props) {
  const block  = props.contentState.getBlockForKey(props.blockKey);
  const data = block.getData();
  const confidence = data.get("confidence");
  
  if (confidence) {
    let style = getStyle(confidence);

    return(
      <span style={style}>
        {props.children}
      </span>
    );
  }

  return(
    <span>
      {props.children}
    </span>
  );
}

export default Word;
