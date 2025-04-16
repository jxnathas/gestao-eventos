export type OrderStatus = 
  | 'pending_payment' 
  | 'paid' 
  | 'canceled' 
  | 'expired';

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  sectorId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'credit' | 'debit';
  couponId?: string;
  createdAt: string;
}