import React from "react";
import TextareaAutosize from '@mui/base/TextareaAutosize';

function Word(word) {
  return(
    <TextareaAutosize
            maxRows={1}
            aria-label="maximum height"
            defaultValue={word.orth}
    />
  );
}

export default Word;