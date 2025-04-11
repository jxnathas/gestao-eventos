import type { Sector } from './sector';
  
export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    description: string;
    bannerUrl: string;
    sectors: Sector[];
    batches?: EventBatch[];
}
  
export interface EventLot {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    isActive: boolean;
}

export type EventWithRelations = Event & {
    sectors: Sector[];
    batches: EventBatch[];
    organizer: User;
}