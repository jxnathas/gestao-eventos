import type { User } from './user';
import type { Sector } from './sector';
  
export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    bannerUrl: string;
    sectors: Sector[];
    lotes?: EventLot[];
    organizerId: User.id;
    createdAt: string;
}
  
export interface EventLot {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    isActive: boolean;
    eventId: string;
    createdAt: string;
}

export type EventWithRelations = Event & {
    sectors: Sector[];
    lotes: EventLot[];
    organizer: User;
}