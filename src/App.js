import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@material-ui/core/Grid'

import DenseAppBar from './components/DenseAppBar';
import MediaCard from './components/media-card/MediaCard';
import TextEditor from './components/text-editor/TextEditor';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <DenseAppBar />
      <Grid container>
        <Grid item xs={6}> 
          <MediaCard />
        </Grid>
        <Grid item xs={6}>
          <TextEditor />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default App;
