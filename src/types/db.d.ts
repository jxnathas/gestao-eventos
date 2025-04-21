import { User } from './user';
import { Event, EventLot } from './events';
import { Sector } from './sector';
import { Coupon } from './coupon';
import { Order } from './orders';
import { Ticket } from './tickets';

export type Database = {
    users: User[];
    events: Event[];
    lots: EventLot[];
    tickets: Ticket[];
    sectors: Sector[];
    coupons: Coupon[];
    orders: Order[];
};