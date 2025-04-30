import React from 'react';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';

interface TicketsHeaderProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const TicketsHeader: React.FC<TicketsHeaderProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Meus Ingressos</h1>
      <div className="mt-4 md:mt-0">
        <BreadCrumbs
          items={[
            { label: 'Todos', href: '#', active: activeFilter === 'all', onClick: () => setActiveFilter('all') },
            { label: 'Ativos', href: '#', active: activeFilter === 'active', onClick: () => setActiveFilter('active') },
            { label: 'Pendentes', href: '#', active: activeFilter === 'pending', onClick: () => setActiveFilter('pending') },
            { label: 'Cancelados', href: '#', active: activeFilter === 'cancelled', onClick: () => setActiveFilter('cancelled') },
            { label: 'Concluídos', href: '#', active: activeFilter === 'completed', onClick: () => setActiveFilter('completed') },
          ]}
        />
      </div>
    </div>
  );
};

export default TicketsHeader;