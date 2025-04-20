
import api from "./api";
import type { Coupon } from "@/types/coupon";


export const fetchCoupons = async (filters: { organizerId?: string; eventId?: string }): Promise<Coupon[]> => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const response = await api.get(`/coupons?${queryParams}`);
  return response.data;
};

export const createCoupon = async (coupon: Omit<Coupon, "id" | "createdAt">): Promise<Coupon> => {
  const response = await api.post("/coupons", coupon);
  return response.data;
};

export const updateCoupon = async (id: string, coupon: Partial<Coupon>): Promise<Coupon> => {
  const response = await api.patch(`/coupons/${id}`, coupon);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await api.delete(`/coupons/${id}`);
};

export default api;