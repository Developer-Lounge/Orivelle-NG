import { create } from 'zustand';
import { DeliveryFeeResponse } from '../types/delivery.js';

interface DeliveryState {
  selectedState: string | null;
  selectedLga: string | null;
  deliveryFee: number | null;
  estimatedDays: number | null;
  isLoading: boolean;
  error: string | null;
  setDeliveryAddress: (state: string, lga?: string) => void;
  setDeliveryFee: (fee: DeliveryFeeResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  selectedState: null,
  selectedLga: null,
  deliveryFee: null,
  estimatedDays: null,
  isLoading: false,
  error: null,

  setDeliveryAddress: (state, lga) =>
    set({
      selectedState: state,
      selectedLga: lga || null,
    }),

  setDeliveryFee: (fee) =>
    set({
      deliveryFee: fee.total_fee,
      estimatedDays: fee.estimated_days,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      selectedState: null,
      selectedLga: null,
      deliveryFee: null,
      estimatedDays: null,
      error: null,
    }),
}));
