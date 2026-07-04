import apiClient from './client.js';
import { DeliveryFeeResponse } from '../types/delivery.js';

export const deliveryApi = {
  /**
   * Calculate delivery fee based on state/LGA
   */
  calculateFee: async (state: string, lga?: string): Promise<DeliveryFeeResponse> => {
    const { data } = await apiClient.post('/delivery/calculate-fee', { state, lga });
    return data;
  },
};
