import React, {Component} from 'react';
import Footer from './Footer';
import socket from '../socket';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import {
  Input,
  Button,
  Container,
  Dialog,
  IconButton,
  Typography,
  AppBar,
  Toolbar
} from '@material-ui/core';

import {withStyles} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {HowToPlay, About} from '.';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const {children, classes, onClose} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      openAbout: false,
      openInstruction: false
    };
  }

  handleClickOpen = type => {
    this.setState({
      [type]: true
    });
  };

  handleClose = () => {
    this.setState({
      openAbout: false,
      openInstruction: false
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    // when a user hits play, we want to send a message to the server that they are starting the game
    socket.emit('playerStartGame', this.state.name);

    // reset state
    this.setState({
      name: ''
    });
  };
  render() {
    return (
      <div className="welcome-box">
        <div className="navbar">
          <AppBar
            position="fixed"
            style={{
              background: 'transparent',
              boxShadow: 'none'
            }}
          >
            <Toolbar className="control-panel">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleClickOpen('openInstruction')}
                className="control-panel-button"
              >
                How To Play
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.handleClickOpen('openAbout')}
                className="control-panel-button"
              >
                About
              </Button>

              <Button variant="contained" className="control-panel-button">
                <a
                  target="_blank"
                  href="https://github.com/awesome-aries/hopper-io"
                >
                  <i className="fab fa-github" /> Github
                </a>
              </Button>
            </Toolbar>
          </AppBar>
        </div>

        <Container className="welcome" align="center">
          <h3 id="gh-quote1" className="gh-quote">
            "A ship in harbor is safe, but that is not what ships are built for"
          </h3>
          <h3 id="gh-quote2" className="gh-quote">
            {' '}
            - Rear Admiral Grace Hopper
          </h3>
          <h1 id="title">Hopper.io</h1>

          <form onSubmit={this.onSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.onChange}
              aria-describedby="name"
              placeholder="Enter your name"
            />

            <Button type="submit" id="play-button">
              Play
            </Button>
          </form>
        </Container>
        <Container align="center">
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.openInstruction || this.state.openAbout}
          >
            {this.state.openInstruction ? (
              <HowToPlay handleClose={this.handleClose} />
            ) : (
              <About handleClose={this.handleClose} />
            )}

            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </Container>

        <Container />

        <Footer />
      </div>
    );
  }
}

export default Welcome;
