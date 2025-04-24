export interface Ticket {
    id: string;
    eventId: string;
    sectorId: string;
    lotId: string;
    userId: string;
    orderId: string;
    status: 'active' | 'used' | 'canceled';
    createdAt: string;
    expiredAt: string;
    location: string;
}