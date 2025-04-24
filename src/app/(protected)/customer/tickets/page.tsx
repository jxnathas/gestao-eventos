"use client"
import React, { useEffect, useState } from 'react';
import withAuth from "@/components/hoc/withAuth";
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { Section } from '@/components/ui/Section';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import { Ticket } from '@/types/tickets';

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'cancelled' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/tickets?userId=${userId}`);
        setTickets(res.data);
        setFilteredTickets(res.data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar ingressos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTickets();
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
    // Lógica para download do ticket
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <div className="p-5">
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

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{ticket.event}</h3>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{new Date(ticket.expiredAt).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{ticket.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-gray-400" />
                        <span>{ticket.sector}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-medium text-gray-700">Valor:</span>
                      <span className="font-bold text-lg text-primary">
                        {typeof ticket.price === 'number' 
                          ? ticket.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Card>
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