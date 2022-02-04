import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import DenseAppBar from './components/DenseAppBar';
import MediaCard from './components/media-card/MediaCard';
import TextEditor from './components/text-editor/TextEditor';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DenseAppBar />
      <Grid container>
        <Grid item xs={5}> 
          <MediaCard />
        </Grid>
        <Grid item xs={7}>
          <TextEditor />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
