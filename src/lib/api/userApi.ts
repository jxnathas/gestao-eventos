import api from "./api";
import type { User } from "@/types/user";

export const fetchUsers = async (filters: { id?: string; email?: string }): Promise<User[]> => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const response = await api.get(`/users?${queryParams}`);
  return response.data;
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const response = await api.post("/users", user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await api.post("/login", { email, password });
  return response.data;
};