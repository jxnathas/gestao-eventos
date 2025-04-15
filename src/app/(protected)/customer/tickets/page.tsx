"use client"
import React, { useEffect, useState } from 'react';
import withAuth from "@/components/hoc/withAuth";
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/ui/Header';
import { Section } from '@/components/ui/Section';
import { BreadCrumbs } from '@/components/ui/BreadCrumbs';
import api from '@/lib/api/api';
import { useAuthStore } from '@/lib/stores/authStore';


const TicketsPage = () => {
const [tickets, setTickets] = useState<Event[]>([]);
const userId = useAuthStore.getState().user?.id || 'defaultUserId';
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await api.get(`/tickets?userId=${userId}`);
      setTickets(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tickets");
      console.error(err);
    }
  };

  if (userId) {
    fetchTickets();
  }
}, [userId]);

return (
  <div className='bg-white min-h-screen'>
    <Header />
    <Container>
      <Section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-3">Meus ingressos</h1>
        <div className="flex space-x-4 mb-6">
          <div className="mb-4">
            <BreadCrumbs
              items={[
                { label: 'Ativos', href: '/' },
                { label: 'Pendentes', href: '/' },
                { label: 'Cancelados', href: '/' },
                { label: 'Encerrados', href: '/' },
              ]}
            />
          </div>
        </div>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.id}>
              <h3>{ticket.event}</h3>
              <p>Data: {new Date(ticket.date).toLocaleString()}</p>
              <p>Localização: {ticket.location}</p>
            </Card>
          ))
        ) : (
          <p>Nenhum ingresso encontrado.</p>
        )}
      </Section>
    </Container>
  </div>
);
};

export default withAuth(TicketsPage)