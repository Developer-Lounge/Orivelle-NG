import apiClient from './client.js';
import { Order, OrderWithItems, CreateOrderRequest } from '../types/order.js';

export const ordersApi = {
  /**
   * Create new order
   */
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },

  /**
   * Get user's orders
   */
  getList: async (params?: { page?: number; limit?: number }) => {
    const { data } = await apiClient.get('/orders', { params });
    return data;
  },

  /**
   * Get single order by ID
   */
  getById: async (orderId: string): Promise<OrderWithItems> => {
    const { data } = await apiClient.get(`/orders/${orderId}`);
    return data;
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (orderId: string, status: string) => {
    const { data } = await apiClient.put(`/orders/${orderId}/status`, { status });
    return data;
  },
};
