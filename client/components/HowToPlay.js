import React from 'react';
import {Container, Typography} from '@material-ui/core';
import {DialogTitle, DialogContent} from './';

const HowToPlay = props => {
  return (
    <Container className="play-instructions">
      <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
        How To Play
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <ol>
            <li>Use arrow keys to control your spacecraft</li>
            <li>
              Capture more space territory by creating a path and returning to
              your harbor.
            </li>
            <li>
              If you or a rival player crosses your path, you lose! So gaurd
              your path when you are outside of your harbor.
            </li>
            <li>To crush opponents, cut off their path</li>
            <li>
              Compete with other players to capture the most space territory in
              the galaxy!
            </li>
          </ol>
        </Typography>
      </DialogContent>
    </Container>
  );
};

export default HowToPlay;
