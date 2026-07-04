import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/auth/supabaseClient.js';
import { useWishlistStore } from '../store/wishlistStore.js';
import { useAuth } from './useAuth.js';

export function useWishlist() {
  const auth = useAuth();
  const { items, setItems, setLoading, setError, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  // Fetch wishlist from database on auth
  useEffect(() => {
    if (!auth.user) return;

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', auth.user!.id);

        if (error) throw error;

        setItems(data?.map((w) => w.product_id) || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [auth.user, setItems, setLoading, setError]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!auth.user) {
        setError('Please sign in to use wishlist');
        return;
      }

      try {
        if (isInWishlist(productId)) {
          // Remove from wishlist
          const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', auth.user.id)
            .eq('product_id', productId);

          if (error) throw error;
          removeFromWishlist(productId);
        } else {
          // Add to wishlist
          const { error } = await supabase.from('wishlists').insert({
            user_id: auth.user.id,
            product_id: productId,
          });

          if (error) throw error;
          addToWishlist(productId);
        }
      } catch (err: any) {
        setError(err.message);
      }
    },
    [auth.user, isInWishlist, addToWishlist, removeFromWishlist, setError]
  );

  return {
    items,
    isInWishlist,
    toggleWishlist,
  };
}
