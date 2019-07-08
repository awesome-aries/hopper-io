import React from 'react';
import Footer from './Footer';

const About = props => {
  return (
    <div>
      <div id="about-info">
        <h1>About</h1>
        <p>
          Inspired by Paper.io, Hopper.io is a multi-player version of the
          popular game released by Voodoo. The goal of the game is to attain as
          much territory as possible.
        </p>
        <br />
        <p>
          Players compete to try and capture territory by forming a tail and
          linking it back to their territory. Like in any other game, there are
          rivals willing to outwit you and take your territory. Be careful to
          gaurd your tail from being attacked by an opponent! You must crush
          your opponents by hitting their tail before they eliminate you!
        </p>
        <br />
        <p>
          The more space you win, the higher ranking and scores you get. You
          have to act and think quickly. Develop your own strategy and action
          plan. Play the game and see if you can claim the biggest territory!
        </p>
        <br />
        <p>
          You can play Hopper.io online on a desktop computer. Get Hopper.io
          today and join the world gaming community. Have fun!
        </p>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default About;