export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'paystack_card' | 'paystack_transfer' | 'cod';

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

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  quantity: number;
  price_at_time: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface CreateOrderRequest {
  email: string;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  lga?: string;
  postal_code: string;
  phone: string;
  cart_items: Array<{
    variant_id: string;
    quantity: number;
  }>;
  payment_method: PaymentMethod;
  discount_code?: string;
}
