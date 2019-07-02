import io from 'socket.io-client';
import clientStore from '../store/index';

const socket = io(window.location.origin);

socket.on('connect', () => {
  console.log('Connected!');
  console.log(`You are ${socket.id}`);
});
let tileMap = clientStore.getState().game.tileMap.present;
console.log(tileMap);
socket.on('currentPlayers', players => {
  console.log('Here are the other players', players);
});
socket.on('newPlayer', player => {
  console.log('A new player has joined', player);
});

export default socket;
