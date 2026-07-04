export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  base_price: number;
  image_url: string;
  is_new: boolean;
  is_flash_sale: boolean;
  flash_sale_price?: number;
  flash_sale_end_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_hex: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  text: string;
  images: string[];
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  email: string;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total: number;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  lga?: string;
  postal_code: string;
  phone: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_reference?: string;
  payment_confirmed_at?: string;
  logistics_provider: string;
  shipment_id?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'paystack_card' | 'paystack_transfer' | 'cod';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  tier: 'regular' | 'vip' | 'pro';
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}
