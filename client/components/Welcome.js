import React, {Component} from 'react';

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <div>
          <input name="name" type="text" />

          <button type="submit">Play</button>
        </div>
      </div>

      // need an onChange handler function for input field that will update the playerName

      // need onClick handler function for button that will trigger game start => playScene
    );
  }
}

// const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({});

export default Welcome;
