import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import prepareTextFromJSON from './text-editor/prepareTextFromJSON';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { textUpdated } from './text-editor/textActions';

const Input = styled('input')({
  display: 'none',
});

export default function DenseAppBar() {
  const logoStyles = {
    width: "100px",
    float: "inline-start"
  }

  const [rawContentData, setRawContentData] = useState(null);
  const dispatch = useDispatch();
  let fileReader;
  function handleFileRead(e) {
    const content = fileReader.result;
    const rawContentData = prepareTextFromJSON(content);
    
    dispatch(textUpdated(rawContentData));
  };

  function onUpload(event) {
    const file = event.target.files[0];
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    const text = fileReader.readAsText(file);
  }

  function onDownload() {

  }
  const buttonStyle = {
    color: "#7FFF00"
  }
  const logoSource = "https://ooona.net/wp-content/uploads/2019/08/logo.svg";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="#7FFF00" component="div" sx={{ flexGrow: 1 }}>
            <b>ASR Editor</b>
          </Typography>
          <label htmlFor="contained-button-file">
            <Input accept=".json" id="contained-button-file" multiple type="file" onChange={onUpload} />
            <Button style ={buttonStyle} component="span">
              <b>Upload JSON</b> 
            </Button>
          </label>
          <Button style ={buttonStyle} onClick={onDownload}>
            <b>Download SRT</b>
          </Button>
          <Typography sx={{ flexGrow: 1 }} />
          <img src={logoSource} alt="logo" style={logoStyles}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


