import { io } from 'socket.io-client';

const URL = 'http://localhost:3002'; 
export const socket = io(URL, { autoConnect: false });

socket.on('payment_approved', (data) => {
  console.log('Pagamento aprovado:', data);
});