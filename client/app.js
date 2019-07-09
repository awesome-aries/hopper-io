import React from 'react';
import {connect} from 'react-redux';

import Welcome from './components/Welcome';
import GameView from './components/GameView';
import GameControlPanel from './components/GameControlPanel';
// import {Navbar} from './components';
// import Routes from './routes';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from './routes';

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  }
}));

const App = props => {
  const classes = useStyles();
  const {isPlaying} = props;
  return (
    <div id="app" className={classes.app}>
      <CssBaseline />
      {/* <Navbar /> */}
      <Routes />
      <div className={classes.main}>
        {!isPlaying && <Welcome />}
        {isPlaying && <GameView />}
        {isPlaying && <GameControlPanel />}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

const mapStateToProps = state => ({
  isPlaying: state.gameState.isPlaying
});

export default connect(mapStateToProps)(App);
