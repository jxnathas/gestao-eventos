import { create } from 'zustand';

type CartItem = {
  eventId: number;
  sectorId: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (eventId: number, sectorId: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (eventId, sectorId) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.eventId === eventId && item.sectorId === sectorId)
      ),
    })),
}));