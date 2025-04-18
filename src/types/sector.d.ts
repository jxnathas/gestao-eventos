export interface Sector {
    id: string;
    eventId: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    sold?: number;
}