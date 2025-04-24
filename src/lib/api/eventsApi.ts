import api from "./api";
import type { Event } from "@/types/events";
import type { Upload } from "@/types/common";

export const fetchEvents = async (filters: { organizerId?: string; id?: string }): Promise<Event[]> => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const response = await api.get(`/events?${queryParams}`);
  return response.data;
};

export const createEvent = async (event: Omit<Event, "id">): Promise<Event> => {
  const response = await api.post("/events", event);
  return response.data;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  const response = await api.patch(`/events/${id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};

export const uploadBanner = async (file: File): Promise<Upload[] | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData);

    return response.data as Upload[];
  } catch (error) {
    console.error("Banner upload failed:", error);
    return null;
  }
};