import apiClient from './client.js';
import { Review, CreateReviewRequest } from '../types/review.js';

export const reviewsApi = {
  /**
   * Get all reviews for a product
   */
  getByProduct: async (productId: string, params?: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get(`/reviews/${productId}`, { params });
    return data;
  },

  /**
   * Create new review
   */
  create: async (reviewData: CreateReviewRequest) => {
    const formData = new FormData();
    formData.append('product_id', reviewData.product_id);
    formData.append('rating', reviewData.rating.toString());
    formData.append('title', reviewData.title);
    formData.append('text', reviewData.text);

    if (reviewData.images) {
      reviewData.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const { data } = await apiClient.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Update review
   */
  update: async (reviewId: string, reviewData: Partial<CreateReviewRequest>) => {
    const { data } = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return data;
  },

  /**
   * Delete review
   */
  delete: async (reviewId: string) => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId: string) => {
    const { data } = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return data;
  },
};
