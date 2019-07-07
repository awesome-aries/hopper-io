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
      </div>
    );
  }
}

export default Welcome;
