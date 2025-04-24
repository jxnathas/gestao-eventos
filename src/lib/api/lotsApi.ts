import api from "./api";
import type { EventLot } from "@/types/events";

export const fetchLots = async (filters: { organizerId?: string; eventId?: string }): Promise<EventLot[]> => {
    const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await api.get(`/lots?${queryParams}`);
    return response.data;
};

export const createLot = async (lot: Omit<EventLot, "id">): Promise<EventLot> => {
    const response = await api.post("/lots", lot);
    return response.data;
};

export const updateLot = async (id: string, lot: Partial<EventLot>): Promise<EventLot> => {
    const response = await api.patch(`/lots/${id}`, lot);
    return response.data;
};

export const deleteLot = async (id: string): Promise<void> => {
    await api.delete(`/lots/${id}`);
};