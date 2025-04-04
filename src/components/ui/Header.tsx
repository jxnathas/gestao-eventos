import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Poggo👾Eventos</h1>
        {user && (
          <Button variant="ghost" onClick={logout}>
            Sair
          </Button>
        )}
      </div>
    </header>
  );
};