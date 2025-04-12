export type Database = {
    users: User[];
    events: Event[];
    sectors: Sector[];
    coupons: Coupon[];
    orders: {
      id: string;
      userId: string;
      eventId: string;
      sectorId: string;
      quantity: number;
      total: number;
      status: 'pending' | 'paid' | 'cancelled';
      paymentMethod: 'pix' | 'credit';
      createdAt: string;
    }[];
};