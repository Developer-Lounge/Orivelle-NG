import { create } from 'zustand';
import { Review } from '../types/review.js';

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReview: (reviewId: string, review: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  setReviews: (reviews) => set({ reviews }),

  addReview: (review) =>
    set((state) => ({
      reviews: [review, ...state.reviews],
    })),

  updateReview: (reviewId, reviewData) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === reviewId ? { ...r, ...reviewData } : r)),
    })),

  deleteReview: (reviewId) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== reviewId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
