import React from 'react';
import {
  Container,
  Typography,
  DialogTitle,
  DialogContent
} from '@material-ui/core';

const About = props => {
  return (
    <Container className="about">
      <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
        About
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Inspired by Paper.io, Hopper.io is a multi-player version of the
          popular game released by Voodoo. The goal of the game is to attain as
          much territory as possible.
        </Typography>
        <Typography gutterBottom>
          Players compete to try and capture territory by forming a path and
          linking it back to their territory. Like in any other game, there are
          rivals trying to outwit you and take your territory. Be careful to
          guard your path from being attacked by an opponent! You must crush
          your opponents by hitting their path before they eliminate you!
        </Typography>
        <Typography gutterBottom>
          The more space you win, the higher ranking and scores you get. You
          have to act and think quickly. Develop your own strategy and action
          plan. Play the game and see if you can claim the biggest territory!
        </Typography>
      </DialogContent>
    </Container>
  );
};

export default About;
