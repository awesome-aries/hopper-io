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
      open: false,
      openAbout: false
    };
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleClickAboutOpen = () => {
    this.setState({
      openAbout: true
    });
  };

  handleAboutClose = () => {
    this.setState({openAbout: false});
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log('onSubmit, name:', this.state.name);

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
                onClick={this.handleClickOpen}
                className="control-panel-button"
              >
                How To Play
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleClickOpen}
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
            A ship in harbor is safe, but that is not what ships are built for
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

        <Container className="play-instructions" align="center">
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleClose}
            >
              How To Play
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                <ol>
                  <li>Use arrow keys to control your spacecraft</li>
                  <li>
                    Capture more space territory by creating a path and
                    returning to your harbor
                  </li>
                  <li>Don't let enemies (or yourself) cross your tail path!</li>
                  <li>To crush opponents, cut off their tail path</li>
                  <li>
                    Compete with other players to capture the most space
                    territory in the galaxy!
                  </li>
                </ol>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </Container>

        {/* <Container className="about-dialog-box">
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleClose}
            >
              About
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Inspired by Paper.io, Hopper.io is a multi-player version of the
                popular game released by Voodoo. The goal of the game is to
                attain as much territory as possible.
              </Typography>
              <Typography gutterBottom>
                Players compete to try and capture territory by forming a tail
                and linking it back to their territory. Like in any other game,
                there are rivals willing to outwit you and take your territory.
                Be careful to gaurd your tail from being attacked by an
                opponent! You must crush your opponents by hitting their tail
                before they eliminate you!
              </Typography>
              <Typography gutterBottom>
                The more space you win, the higher ranking and scores you get.
                You have to act and think quickly. Develop your own strategy and
                action plan. Play the game and see if you can claim the biggest
                territory!
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        </Container> */}

        <Container />

        <Footer />
      </div>
    );
  }
}

export default Welcome;
