# Hopper.io

## Multiplayer Browser Game

Inspired by [Paper.io](http://paper-io.com/), this is a multiplayer version of the popular game by Voodoo. Players compete to try and capture as musch territory as possible by forming a line and linking it back to your terrotiry. Be careful not to touch your own line while doing so, because you will die! You can also crush opponents by hitting them while they're forming a line. Can you claim the biggest territory?

## Live Demo

A live, playable version of the game can be found here (need to add link to deployed site here).

The goal of this game is to capture as mush territory as possible!!

## Tech Stack/Architecture

Hopper.io is built on [Node.js](https://nodejs.org/) using the Javascript game framework [Phaser](http://phaser.io/) for implementing game mechanics, [Socket.IO](http://socket.io/) for client-server interaction, [React](https://facebook.github.io/react/) for HTML rendering, and [Redux](http://redux.js.org/) for both client and server app state and game state management.

* Node.js
* Phaser
* Socket.io
* React
* Redux
* Material UI

## How To Play

* Use the arrow keys (or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>) to move your cart left, right, up, or down.
* Outline the area you wish to capture by creating a path from the harbor, forming a loop, and closing the loop by returning to your harbor.
* Take area from opponents by capturing territory from their harbor.
* To kill an opponent, run through their 'tail path' that they leave behind.
* Avoid being killed by other players.
* The player with the most territory wins the game!

## Installation

## Team Members

## Credits
