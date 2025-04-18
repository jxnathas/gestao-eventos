import { Sector } from './sector';
  
export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    bannerUrl: string;
    organizerId: string;
    createdAt: string;
    isActive?: boolean;
}
  
export interface EventLot {
    id: string;
    eventId: string;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    discount?: number;
    isActive: boolean;
    eventId: string;
    createdAt: string;
}

export type EventWithRelations = Event & {
    sectors: Sector[];
    lotes: EventLot[];
    organizer: User;
}

export { Sector };
