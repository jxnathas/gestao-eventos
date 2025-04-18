export interface CartItem {
    eventId: string;
    sectorId: string;
    quantity: number;
    price: number;
};

export interface CartState  {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (eventId: string, sectorId: string) => void;
};