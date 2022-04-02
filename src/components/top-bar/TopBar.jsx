import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, Chip } from '@mui/material';
import prepareTextFromJSON from '../text-editor/prepareTextFromJSON';
import { connect, useDispatch } from 'react-redux';
import { uploadTextFromFile } from '../text-editor/textActions';
import fileDownload from 'js-file-download';
import getSRTFromContent from './getSRTFromContent';

const Input = styled('input')({
  display: 'none',
});

function TopBar(props) {
  const logoStyles = {
    width: '100px',
    float: 'inline-start'
  }

  const dispatch = useDispatch();
  let fileReader;

  function handleFileRead(e) {
    const content = fileReader.result;
    const rawContentData = prepareTextFromJSON(content);
    dispatch(uploadTextFromFile(rawContentData));
  };

  function onUpload(event) {
    const file = event.target.files[0];
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    const text = fileReader.readAsText(file);
  }
 
  function onDownload() {
    const content = getSRTFromContent(props.rawContentData, props.frameRate);
    fileDownload(content, 'Amyloidosis Awareness.srt');
  }
  const buttonStyle = {
    color: '#7FFF00'
  }
  const logoSource = 'https://ooona.net/wp-content/uploads/2019/08/logo.svg';
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <Typography variant='h6' color='#7FFF00' component='div' sx={{ flexGrow: 1 }}>
            <b>ASR Editor</b>
          </Typography>
          <label htmlFor='contained-button-file'>
            <Input 
              accept='.json' 
              id='contained-button-file' 
              multiple type='file' 
              onChange={onUpload}
              onClick={(event) => event.target.value = ''}
            />
            <Button style ={buttonStyle} component='span'>
              <b>Upload JSON</b> 
            </Button>
          </label>
          <Button style ={buttonStyle} onClick={onDownload}>
            <b>Download SRT</b>
          </Button>
          <Typography sx={{ flexGrow: 1 }} />
          <Chip 
            label={props.isSaved ? "Saved" : "Unsaved"} 
            variant='outlined' 
            color='warning' 
            sx={{ gap: 20, width: 80 }}
          />
          <Typography sx={{ flexGrow: 1 }} />
          <img src={logoSource} alt='logo' style={logoStyles}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    rawContentData: state.text.rawContentData,
    isSaved: state.text.isSaved,
    frameRate: state.media.frameRate
  }
}

export default connect(mapStateToProps)(TopBar);