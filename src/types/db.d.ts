import { User } from './user';
import { Event } from './events';
import { Sector } from './sector';
import { Coupon } from './coupon';
import { Order } from './orders';

export type Database = {
    users: User[];
    events: Event[];
    sectors: Sector[];
    coupons: Coupon[];
    orders: Order[];
};