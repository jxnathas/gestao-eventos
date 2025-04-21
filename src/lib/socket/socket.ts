import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
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

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });

  socket.on('connect_timeout', () => {
    console.warn('Connection timed out.');
  });
}