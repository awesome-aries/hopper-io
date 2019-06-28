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
        <p>regularTile: 0, borderTile: 2, harborTile: 1, pathTile: 3</p>
        {this.props.children}
      </div>
    );
  }
}

export default Ui;
