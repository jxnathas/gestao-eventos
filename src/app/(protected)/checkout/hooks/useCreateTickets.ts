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

  const createTickets = async (orderId: string) => {
    setIsCreating(true);
    setError(null);

    try {
      const orderResponse = await api.get(`/orders/${orderId}`);
      const order = orderResponse.data;

      if (!order.sectors || !Array.isArray(order.sectors)) {
        throw new Error('Invalid order data: sectors not found or invalid.');
      }

      const ticketPromises = order.sectors.map((sector: TicketPayload) =>
        api.post('/tickets', {
          eventId: order.eventId,
          sectorId: sector.sectorId,
          quantity: sector.quantity,
          price: sector.price,
        })
      );

      await Promise.all(ticketPromises);
      console.log('Tickets created successfully.');
    } catch (err) {
      console.error('Failed to create tickets:', err);
      setError('Failed to create tickets. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTickets = async () => {
    await createTickets(orderId); // Ensure this is awaited
  };

  return { createTickets, isCreating, error, handleCreateTickets };
}