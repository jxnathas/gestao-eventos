"use client";
import React, { useEffect, useState } from 'react';
import withAuth from "@/components/hoc/withAuth";
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { Section } from '@/components/ui/Section';
import { fetchTickets } from '@/lib/api/ticketsApi';
import { useAuthStore } from '@/lib/stores/authStore';
import { Ticket } from '@/types/tickets';
import { FaTicketAlt } from 'react-icons/fa';
import TicketsHeader from './components/TicketsHeader';
import TicketCard from './components/TicketCard';
import Spinner from '@/components/ui/Spinner';
import ErrorState from './components/ErrorState';

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'cancelled' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await fetchTickets({ userId });
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar ingressos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadTickets();
    }
  }, [userId]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(ticket => ticket.status === activeFilter));
    }
  }, [activeFilter, tickets]);

  const handleDownloadTicket = (ticketId: string) => {
    console.log(`Downloading ticket ${ticketId}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Header />
      <Container>
        <Section className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <TicketsHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <ErrorState errorMessage={error} onRetry={() => window.location.reload()} />
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  getStatusBadgeColor={getStatusBadgeColor}
                  getStatusLabel={getStatusLabel}
                  handleDownloadTicket={handleDownloadTicket}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaTicketAlt className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum ingresso encontrado</h3>
              <p className="text-gray-500">Você não possui ingressos {activeFilter !== 'all' ? `com status ${getStatusLabel(activeFilter)}` : ''}</p>
            </div>
          )}
        </Section>
      </Container>
    </div>
  );
};

export default withAuth(TicketsPage);