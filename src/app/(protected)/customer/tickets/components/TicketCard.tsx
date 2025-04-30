import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import { Ticket } from '@/types/tickets';
import { useEvent } from '@/hooks/useEvent';
import { useSectors } from '@/hooks/useSectors';
import { useUser } from '@/hooks/useUser';

interface TicketCardProps {
  ticket: Ticket;
  getStatusBadgeColor: (status: Ticket['status']) => string;
  getStatusLabel: (status: Ticket['status']) => string;
  handleDownloadTicket: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, getStatusBadgeColor, getStatusLabel, handleDownloadTicket }) => {
  const { event, loading: eventLoading } = useEvent(ticket.eventId);
  const { sectors, loading: sectorsLoading } = useSectors(ticket.eventId);
  const { user, loading: userLoading } = useUser(ticket.userId);

  const sector = sectors.find((s) => s.id === ticket.sectorId);

  if (eventLoading || sectorsLoading || userLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <div className="flex justify-between items-start mb-3">
        <Badge color={getStatusBadgeColor(ticket.status)}>
          {getStatusLabel(ticket.status)}
        </Badge>
        <Button
          size="small"
          variant="ghost"
          onClick={() => handleDownloadTicket(ticket.id)}
          className="text-gray-500 hover:text-primary"
        >
          <FiDownload className="mr-1" /> Baixar
        </Button>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{event?.name || 'Evento Desconhecido'}</h3>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <span>{new Date(ticket.expiredAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{event?.location || 'Localização Desconhecida'}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-gray-400" />
          <span>{sector?.name || 'Setor Desconhecido'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-medium text-gray-700">Comprado por:</span>
        <span className="font-bold text-gray-800">{user?.name || 'Usuário Desconhecido'}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-medium text-gray-700">Valor:</span>
        <span className="font-bold text-lg text-primary">
          {ticket.price ? Number(ticket.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}
        </span>
      </div>
    </Card>
  );
};

export default TicketCard;