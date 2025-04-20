import api from "./api";
import type { Sector } from "@/types/sector";

export const fetchSectors = async (filters: { organizerId?: string }): Promise<Sector[]> => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const response = await api.get(`/sectors?${queryParams}`);
  return response.data;
};

export const createSectors = async (sector: Omit<Sector, "id">): Promise<Sector> => {
  const response = await api.post("/sectors", sector);
  return response.data;
};

export const updateSectors = async (id: string, sector: Partial<Sector>): Promise<Sector> => {
  const response = await api.patch(`/sectors/${id}`, sector);
  return response.data;
};

export const deleteSectors = async (id: string): Promise<void> => {
  await api.delete(`/sectors/${id}`);
};

export const fetchSectorsByEventId = async (eventId: string): Promise<Sector[]> => {
  const response = await api.get(`/sectors?eventId=${eventId}`);
  return response.data;
};