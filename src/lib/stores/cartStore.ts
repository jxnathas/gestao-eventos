import { create } from 'zustand';
import { CartState } from '@/types';

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