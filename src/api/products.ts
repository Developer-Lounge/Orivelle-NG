import apiClient from './client.js';
import { Product, ProductVariant } from '../types/product.js';
import { Review } from '../types/review.js';

export const productsApi = {
  /**
   * Get all products with optional filtering
   */
  getAll: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    include_variants?: boolean;
  }) => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  /**
   * Get single product by ID or slug
   */
  getById: async (idOrSlug: string) => {
    const { data } = await apiClient.get(`/products/${idOrSlug}`);
    return data;
  },

  /**
   * Get product reviews
   */
  getReviews: async (productId: string, params?: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get(`/products/${productId}/reviews`, { params });
    return data;
  },
};
