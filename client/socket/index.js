import io from 'socket.io-client';
import initClientListeners from './listeners';

const socket = io(window.location.origin);

socket.on('connect', () => {
  initClientListeners(io, socket);
});

export default socket;
