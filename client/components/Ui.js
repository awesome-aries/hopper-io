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
        {this.props.children}
      </div>
    );
  }
}

export default Ui;
