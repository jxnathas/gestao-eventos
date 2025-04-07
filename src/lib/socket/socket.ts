import { io } from 'socket.io-client';

const URL = 'http://localhost:3002'; 
export const socket = io(URL, {
  autoConnect: false,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

type PaymentData = {
  id: string;
  status: 'approved' | 'rejected';
  amount: number;
};


export function setupSocketListeners() {
  socket.on('payment_approved', (data: PaymentData) => {
    console.log('Pagamento aprovado:', data);
  });
}