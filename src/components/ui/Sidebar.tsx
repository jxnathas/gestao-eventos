'use client';
import { usePathname } from 'next/navigation';
import { ButtonLink } from './ButtonLink';
import { FaTachometerAlt, FaTicketAlt, FaTags, FaCogs, FaUser, FaCalendarAlt } from 'react-icons/fa';

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Eventos', href: '/my-events', icon: <FaCalendarAlt /> },
    { name: 'Cupons', href: '/coupons', icon: <FaTags /> },
    { name: 'Setores', href: '/sectors', icon: <FaTicketAlt /> },
    { name: 'Perfil', href: '/profile', icon: <FaUser /> },
    { name: 'Configurações', href: '/settings', icon: <FaCogs /> },
  ];

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-50 h-screen border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <ButtonLink
                  key={item.name}
                  href={item.href}
                  size="small"
                  variant={isActive ? 'ghost' : 'primary'}
                  className={`w-full justify-start flex items-center gap-2 ${isActive ? 'bg-gray-100' : ''}`}
                >
                  {item.icon} {item.name}
                </ButtonLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};