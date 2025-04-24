import { useState } from 'react';
import api from '@/lib/api/api';

interface TicketPayload {
  eventId: string;
  sectorId: string;
  quantity: number;
  price: number;
}

export function useCreateTickets() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketsCreated, setTicketsCreated] = useState(false);

  const createTickets = async (orderId: string) => {
    if (ticketsCreated || isCreating) return;

    setIsCreating(true);
    setError(null);

    try {
      const orderResponse = await api.get(`/orders/${orderId}`);
      const order = orderResponse.data;

      if (!order.sectors || !Array.isArray(order.sectors)) {
        throw new Error('Invalid order data: sectors not found or invalid.');
      }

      const ticketsResponse = await api.get(`/tickets?orderId=${orderId}`);
      if (ticketsResponse.data.length > 0) {
        console.log('Tickets already exist for this order.');
        return;
      }

      const ticketPromises = order.sectors.flatMap((sector: TicketPayload) =>
        Array.from({ length: sector.quantity }).map(() =>
          api.post('/tickets', {
            eventId: order.eventId,
            sectorId: sector.sectorId,
            price: sector.price,
            orderId: orderId
          })
        )
      );

      await Promise.all(ticketPromises);
      setTicketsCreated(true);
      console.log('Tickets created successfully.');
    } catch (err) {
      console.error('Failed to create tickets:', err);
      setError('Failed to create tickets. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return { createTickets, isCreating, error };
}