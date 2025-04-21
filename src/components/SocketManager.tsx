'use client';
import { useEffect } from 'react';
import { socket, setupSocketListeners } from '@/lib/socket/socket';
import { useAuthStore } from '@/lib/stores/authStore';
import toast from 'react-hot-toast';

export function SocketManager() {
  const { token } = useAuthStore();

  useEffect(() => {
    setupSocketListeners();

    socket.on('payment_approved', (data) => {
      toast.success(`Payment approved for order ${data.id}!`);
    });

    socket.on('connect', () => {
      toast.success('Connected to the server.');
    });

    socket.on('disconnect', (reason) => {
      toast.error(`Disconnected: ${reason}`);
    });

    return () => {
      socket.off('payment_approved');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }
  }, [token]);

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('unauthorized', (err) => {
      console.error('Unauthorized:', err.message);
    });

    return () => {
      socket.off('connect_error');
      socket.off('unauthorized');
    };
  }, []);

  return null;
}