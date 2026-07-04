import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/auth/supabaseClient.js';
import { Review } from '../types/review.js';
import { useReviewStore } from '../store/reviewStore.js';

export function useReviews(productId: string) {
  const { reviews, setReviews, setLoading, setError } = useReviewStore();
  const [isLocal, setIsLocal] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      setIsLocal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId, setReviews, setLoading, setError]);

  useEffect(() => {
    if (isLocal) return; // Don't refetch if we already have local data
    fetchReviews();
  }, [productId, fetchReviews, isLocal]);

  const addReview = useCallback(
    async (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('product_reviews')
          .insert({
            ...review,
            product_id: productId,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          useReviewStore.getState().addReview(data);
        }

        return { success: true };
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    [productId, setError]
  );

  return {
    reviews,
    addReview,
    refetch: fetchReviews,
  };
}
