import React from 'react';

const HowToPlay = props => {
  return (
    <div id="instructions">
      <h1>How To Play</h1>
      <ol>
        <li>Use arrows or WSAD to control your spacecraft</li>
        <li>
          Capture more space territory by creating a path and returning to your
          harbor
        </li>
        <li>Don't let enemies (or yourself) cross your tail path!</li>
        <li>To crush opponents, cut off their tail path</li>
        <li>
          Compete with other players to capture the most space territory in the
          galaxy!
        </li>
      </ol>
    </div>
  );
};

export default HowToPlay;
