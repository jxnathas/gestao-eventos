import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 flex justify-between items-center border-t-8 border-purple-800">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">Poggo👾Eventos</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden md:inline">
              Olá, {user.name}
            </span>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="px-3 py-1 text-sm"
            >
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};