import { useCallback } from 'react';
import { deliveryApi } from '../api/delivery.js';
import { useDeliveryStore } from '../store/deliveryStore.js';

export function useDeliveryFee() {
  const { selectedState, selectedLga, deliveryFee, estimatedDays, isLoading, error, setDeliveryFee, setLoading, setError } =
    useDeliveryStore();

  const calculateFee = useCallback(
    async (state: string, lga?: string) => {
      setLoading(true);
      setError(null);
      try {
        const fee = await deliveryApi.calculateFee(state, lga);
        setDeliveryFee(fee);
        return { success: true, fee };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [setDeliveryFee, setLoading, setError]
  );

  return {
    selectedState,
    selectedLga,
    deliveryFee,
    estimatedDays,
    isLoading,
    error,
    calculateFee,
  };
}
