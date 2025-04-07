'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { socket } from '@/lib/socket/socket';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();

    if (token && !socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    const onConnectError = (err: Error) => {
      console.error('Falha na conexão:', err);
    };

    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect_error', onConnectError);
    };
  }, [token, initializeAuth]);

  return <>{children}</>;
}