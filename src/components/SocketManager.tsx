'use client';
import { useEffect } from 'react';
import { socket, setupSocketListeners } from '@/lib/socket/socket';
import { useAuthStore } from '@/lib/stores/authStore';

export function SocketManager() {
  const { token } = useAuthStore();

  useEffect(() => {
    setupSocketListeners();

    return () => {
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

  return null;
}