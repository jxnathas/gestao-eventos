"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { socket } from '@/lib/socket/socket';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      useAuthStore.setState({ token });
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}