import { io } from 'socket.io-client';

const URL = 'http://localhost:3002';
export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export function setupSocketListeners() {
  socket.on('connect', () => {
    console.log('Conectado:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Desconectado:', reason);
  });
}