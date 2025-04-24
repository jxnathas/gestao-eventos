import api from "./api";
import type { Ticket } from "@/types/tickets";

export const fetchTickets = async (filters: { userId?: string; eventId?: string }): Promise<Ticket[]> => {
    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await api.get(`/tickets?${queryParams}`);
    return response.data;
};

export const createTicket = async (ticket: Omit<Ticket, "id">): Promise<Ticket> => {
    const response = await api.post("/tickets", ticket);
    return response.data;
};

export const updateTicket = async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}`, ticket);
    return response.data;
};

export const deleteTicket = async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
};
