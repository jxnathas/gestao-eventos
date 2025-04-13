import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { ButtonLink } from './ButtonLink';

interface HeaderProps {
  isHome?: boolean;
}

export const Header = ({ isHome = false }: HeaderProps) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 flex justify-between items-center border-t-8 border-purple-800">
        <div className="flex items-center">
            <ButtonLink variant='none' href="/" className="text-xl font-bold text-gray-800">
            Poggo👾Eventos
            </ButtonLink>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isHome ? (
                <>
                  <ButtonLink href="/dashboard" className="px-3 py-1 text-sm">
                    Criar evento
                  </ButtonLink>
                  <ButtonLink href="/my-events" className="px-3 py-1 text-sm ">
                    Meus eventos
                  </ButtonLink>
                  <ButtonLink href="/customer/tickets" className="px-3 py-1 text-sm ">
                    Meus ingressos
                  </ButtonLink>
                </>
              ) : (
                <span className="text-sm text-gray-600 hidden md:inline">
                  Olá, {user.name}
                </span>
              )}
              <Button
                variant="link"
                onClick={logout}
                className="px-3 py-1 text-sm"
              >
                Sair
              </Button>
            </>
          ) : (
            <ButtonLink href="/login" className="px-3 py-1 text-sm">
              Entrar
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
};
