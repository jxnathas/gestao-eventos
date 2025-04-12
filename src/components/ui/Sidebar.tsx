'use client';
import { usePathname } from 'next/navigation';
import { ButtonLink } from './ButtonLink';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Eventos', href: '/events' },
    { name: 'Ingressos', href: '/tickets' },
    { name: 'Cupons', href: '/coupons' },
    { name: 'Setores', href: '/sectors' },
    { name: 'Clientes', href: '/customers' },
    { name: 'Configurações', href: '/settings' },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              
              return (
                <ButtonLink
                  key={item.name}
                  href={item.href}
                  variant={isActive ? 'secondary' : 'primary'}
                  className={`w-full justify-start ${isActive ? 'bg-gray-100' : ''}`}
                >
                  {item.name}
                </ButtonLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};