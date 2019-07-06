## Hopper.io

### Multiplayer Browser Game

Inspired by [Paper.io](http://paper-io.com/), this is a multi-player version of the popular game released by Voodoo. The goal of the game is to attain as much territory as possible. Players compete to try and capture territory by forming a line and linking it back to their territory. Be careful not to touch your own line while doing so, because you will die! You can also crush opponents by hitting them while they're forming a line. Play the game and see if you can claim the biggest territory!

### Live Demo

A playable online build of Hopper.io can be found here (need to add deployed site link)

### Team Members


### App Architecture

Hopper.io is built on [Node.js](https://nodejs.org/) using the Javascript game framework [Phaser](http://phaser.io/) for implementing game mechanics, [Socket.IO](http://socket.io/) for client-server interaction, [React](https://facebook.github.io/react/) for HTML rendering, [Redux](http://redux.js.org/) for both client and server app state and game state management, [React-redux](https://github.com/reduxjs/react-redux) to maintain data flow and bind react components with redix store, [Webpack](https://github.com/webpack/webpack) to bundle our JavaScript assets, [Express](https://expressjs.com/) to manage HTTP requests, [PostgreSQL](https://www.postgresql.org/) to manage relational data [Sequelize](http://docs.sequelizejs.com/) to write SQL in Javascript fashion, and [Material UI](https://material-ui.com/) for design.

### How To Play

* Use the arrow keys (or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>) to move your ship left, right, up, or down.
* Outline the area you wish to capture by creating a path from the harbor, forming a loop, and closing the loop by returning to your harbor.
* Take area from opponents by capturing territory from their harbor.
* To kill an opponent, run through their 'tail path' that they leave behind.
* Avoid being killed by other players.
* The player with the most territory wins the game!

### Getting Started

To get the app started and running on your local machine for development purpose, first you need to install all the dependencies:
```
$npm install
```

To start the app in development mode, run the command below:
```
$npm run start-dev
```
Open localhost:8080 to run the app on your browser.
