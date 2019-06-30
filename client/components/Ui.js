import React from 'react';

class Ui extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div id="ui">
        <h1>Hopper.io</h1>
        <h3>Testing Info</h3>
        <p>regularTile: 0, borderTile: 2, harborTile: 1, pathTile: 3</p>
        <p>
          click tile to set harbor, shift + click to floodfill, arrow keys to
          move ship, hit space to stop moving
        </p>
        {this.props.children}
      </div>
    );
  }
}

export default Ui;
