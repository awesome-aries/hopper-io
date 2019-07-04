import React, {Component} from 'react';
import socket from '../socket';
import clientStore, {clientActionCreators} from '../store';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      name: ''
    };
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log('onSubmit');

    // we want to change the game state to isPlaying and set their name
    // this should then make the view change from the welcome component to gameView
    clientStore.dispatch(
      clientActionCreators.gameState.startGame(this.state.name)
    );

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

            <Button type="submit">Play</Button>
          </form>
        </Container>
      </div>

      // need an onChange handler function for input field that will update the playerName

      // need onClick handler function for button that will trigger game start => playScene
    );
  }
}

// const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({});

export default Welcome;
