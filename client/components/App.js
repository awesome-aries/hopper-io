import React, {Component} from 'react';
import {connect} from 'react-redux';

import Welcome from './Welcome';
import GameView from './GameView';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from './Navbar';
import Footer from './Footer';

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

class App extends Component {
  constructor() {
    super();
    this.classes = useStyles();
  }
  render() {
    // const classes = useStyles();
    const {isPlaying} = this.props;
    return (
      <div>
        <div id="app">
          <CssBaseline />
          <Navbar />
          {/* <Routes className={classes.main} /> */}
          <Footer />
        </div>
        <div className={this.classes.main}>
          {!isPlaying && <Welcome />}
          {isPlaying && <GameView />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isPlaying: state.gameState.isPlaying
});

// const mapDispatchToProps = dispatch => ({
//   // thunk: () => dispatch(thunk())
// });

export default connect(mapStateToProps)(App);
