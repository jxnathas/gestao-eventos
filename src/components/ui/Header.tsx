import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { ButtonLink } from './ButtonLink';
import { FaCalendarCheck, FaPlusCircle, FaSignOutAlt, FaTicketAlt, FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  isHome?: boolean;
}

export const Header = ({ isHome = false }: HeaderProps) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 flex justify-between items-center border-t-8 border-purple-800">
        <div className="flex items-center gap-4">
          <ButtonLink variant="none" href="/" className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
             Poggo👾
          </ButtonLink>
          {user && (
            <ButtonLink variant='none' href="/dashboard" className="text-sm text-purple-800 flex items-center gap-2">
              Dashboard
            </ButtonLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isHome ? (
                <>
                    <ButtonLink href="/my-events/create" className="px-3 py-1 text-sm flex items-center gap-2">
                    <FaPlusCircle /> Criar evento
                    </ButtonLink>
                    <ButtonLink href="/my-events" className="px-3 py-1 text-sm flex items-center gap-2">
                    <FaCalendarCheck /> Meus eventos
                    </ButtonLink>
                    <ButtonLink href="customer/tickets" className="px-3 py-1 text-sm flex items-center gap-2">
                    <FaTicketAlt /> Meus ingressos
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
                className="px-3 py-1 text-sm flex items-center gap-2"
              >
                <FaSignOutAlt /> Sair
              </Button>
            </>
          ) : (
            <ButtonLink href="/login" className="px-3 py-1 text-sm flex items-center gap-2">
              <FaUserCircle /> Entrar
            </ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
};
