//here we can have a function in which we are constantly broadcasting the state on the server side to the state on the client side set on an interval (possibly 2-3 times per second)
module.exports = function(io) {
  // we want to broadcast the current state of the game to all players on a set interval
  let interval = 1000 / 30;
  setInterval(() => {
    // here is where we need to get the current state and then broadcast it to all players
  }, interval);
};
