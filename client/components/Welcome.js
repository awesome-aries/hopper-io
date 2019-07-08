import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import socket from '../socket';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

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
      open: false
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

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log('onSubmit');

    // when a user hits play, we want to send a message to the server that they are starting the game
    socket.emit('playerStartGame', socket.id, this.state.name);

    // reset state
    this.setState({
      name: ''
    });
  };
  render() {
    return (
      <div className="welcome-box">
        <Container className="welcome" align="center">
          <h3 id="gh-quote1">
            A ship in harbor is safe, but that is not what ships are built for
          </h3>
          <h3 id="gh-quote2"> - Rear Admiral Grace Hopper</h3>
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

        <Container id="control-panel">
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleClickOpen}
            className="control-panel-button"
          >
            How To Play
          </Button>

          <Link to="/about">
            <Button
              variant="contained"
              color="secondary"
              className="control-panel-button"
            >
              About
            </Button>
          </Link>

          <Button
            variant="contained"
            // color="primary"
            className="control-panel-button"
          >
            <a href="https://github.com/awesome-aries/hopper-io">Github</a>
          </Button>

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
                    <li>Use arrows or WSAD to control your spacecraft</li>
                    <li>
                      Capture more space territory by creating a path and
                      returning to your harbor
                    </li>
                    <li>
                      Don't let enemies (or yourself) cross your tail path!
                    </li>
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

          <Container />
        </Container>
      </div>
    );
  }
}

export default Welcome;
