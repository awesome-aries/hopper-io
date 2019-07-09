import React from 'react';
import {connect} from 'react-redux';

import Welcome from './components/Welcome';
import GameView from './components/GameView';
import GameOver from './components/GameOver';
import GameControlPanel from './components/GameControlPanel';
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
  const {isPlaying, isDead} = props;
  return (
    <div id="app" className={classes.app}>
      <CssBaseline />
      <Routes />
      <div className={classes.main}>
        {!isPlaying && isDead ? <GameOver /> : null}
        {!isPlaying && !isDead ? <Welcome /> : null}
        {isPlaying && <GameView />}
        {/* {isPlaying && <GameControlPanel />} */}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isPlaying: state.gameState.isPlaying,
  isDead: state.gameState.isDead
});

export default connect(mapStateToProps)(App);
