import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Product IDs
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setItems: (items: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addToWishlist: (productId) =>
        set((state) => {
          if (!state.items.includes(productId)) {
            return { items: [...state.items, productId] };
          }
          return state;
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      isInWishlist: (productId) => get().items.includes(productId),

      setItems: (items) => set({ items }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
