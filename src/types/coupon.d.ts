export interface Coupon {
    id: string;
    code: string;
    discount: number;
    validUntil: string;
    organizerId: string;
    eventId?: string;
    createdAt: string;
    isGlobal: boolean;
    isActive: boolean;
};