import api from "./api";
import type { Sector } from "@/types/sector";

export const fetchSectors = async (filters: { organizerId?: string; eventId?: string }): Promise<Sector[]> => {
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