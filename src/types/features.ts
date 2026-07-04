export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

export interface SavedCard {
  id: string;
  user_id: string;
  last4: string;
  brand: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  created_at: string;
}

export interface LoyaltyAccount {
  user_id: string;
  points_balance: number;
  tier: 'regular' | 'vip' | 'pro';
  total_spent: number;
  member_since: string;
}
