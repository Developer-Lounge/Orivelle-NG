-- ============================================================================
-- ORIVELLE E-COMMERCE DATABASE SCHEMA
-- Supabase PostgreSQL
-- Run this SQL in Supabase SQL Editor (Query section)
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'regular' CHECK (tier IN ('regular', 'vip', 'pro')),
  loyalty_points INT DEFAULT 0 CHECK (loyalty_points >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0),
  image_url TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  flash_sale_price DECIMAL(10, 2),
  flash_sale_end_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are public"
  ON public.products
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);

-- ============================================================================
-- 3. PRODUCT VARIANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  color_hex TEXT,
  size TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants are public"
  ON public.product_variants
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);

-- ============================================================================
-- 4. PRODUCT REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0 CHECK (helpful_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public"
  ON public.product_reviews
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Users can create own reviews"
  ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON public.product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX idx_product_reviews_verified ON public.product_reviews(verified_purchase);
CREATE INDEX idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- ============================================================================
-- 5. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ORV-' || TO_CHAR(NOW(), 'YYYYMM') || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0')),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10, 2) NOT NULL CHECK (delivery_fee >= 0),
  discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  
  full_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT,
  postal_code TEXT,
  phone TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paystack_card', 'paystack_transfer', 'cod')),
  payment_reference TEXT UNIQUE,
  payment_confirmed_at TIMESTAMP WITH TIME ZONE,
  
  logistics_provider TEXT DEFAULT 'static',
  shipment_id TEXT,
  
  discount_code_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR email = auth.jwt() ->> 'email');

CREATE POLICY "Users can create orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_email ON public.orders(email);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_payment_ref ON public.orders(payment_reference);

-- ============================================================================
-- 6. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL CHECK (price_at_time > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items are readable with order"
  ON public.order_items
  FOR SELECT
  USING (true);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_variant_id ON public.order_items(variant_id);

-- ============================================================================
-- 7. CART ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, variant_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cart"
  ON public.cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own cart"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON public.cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);

-- ============================================================================
-- 8. ABANDONED CARTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  cart_items JSONB NOT NULL,
  abandoned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_recovered_at TIMESTAMP WITH TIME ZONE,
  recovery_count INT DEFAULT 0 CHECK (recovery_count >= 0),
  recovered_order_id TEXT REFERENCES public.orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_abandoned_carts_user_id ON public.abandoned_carts(user_id);
CREATE INDEX idx_abandoned_carts_email ON public.abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_abandoned_at ON public.abandoned_carts(abandoned_at DESC);

-- ============================================================================
-- 9. SAVED CARDS TABLE (for returning customers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  card_token TEXT NOT NULL,
  last4 TEXT NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('visa', 'mastercard', 'amex', 'other')),
  exp_month INT CHECK (exp_month >= 1 AND exp_month <= 12),
  exp_year INT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_token)
);

ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cards"
  ON public.saved_cards
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cards"
  ON public.saved_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON public.saved_cards
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards"
  ON public.saved_cards
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_saved_cards_user_id ON public.saved_cards(user_id);

-- ============================================================================
-- 10. WISHLISTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist"
  ON public.wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own wishlist"
  ON public.wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist"
  ON public.wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON public.wishlists(product_id);

-- ============================================================================
-- 11. STATE & LGA DELIVERY RATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.state_lga_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  lga TEXT,
  flat_fee DECIMAL(10, 2) NOT NULL CHECK (flat_fee > 0),
  per_km_fee DECIMAL(10, 2) DEFAULT 0 CHECK (per_km_fee >= 0),
  estimated_days INT DEFAULT 2 CHECK (estimated_days > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, lga)
);

ALTER TABLE public.state_lga_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rates are public"
  ON public.state_lga_rates
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE INDEX idx_state_lga_rates_state_lga ON public.state_lga_rates(state, lga);

-- ============================================================================
-- 12. DISCOUNT CODES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'flat', 'first_order')),
  value DECIMAL(10, 2) NOT NULL CHECK (value > 0),
  max_uses INT,
  current_uses INT DEFAULT 0 CHECK (current_uses >= 0),
  min_cart_value DECIMAL(10, 2),
  max_discount_value DECIMAL(10, 2),
  first_order_only BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Codes are public"
  ON public.discount_codes
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_expires_at ON public.discount_codes(expires_at);

-- ============================================================================
-- 13. LOYALTY LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.loyalty_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  points_amount INT NOT NULL CHECK (points_amount != 0),
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
  related_order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.loyalty_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own loyalty log"
  ON public.loyalty_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_loyalty_log_user_id ON public.loyalty_log(user_id);
CREATE INDEX idx_loyalty_log_created_at ON public.loyalty_log(created_at DESC);

-- ============================================================================
-- 14. EMAIL CAPTURES TABLE (for marketing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_order_discount_used BOOLEAN DEFAULT FALSE,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SEED DATA: Products (sample)
-- ============================================================================

-- Insert sample product (will be replaced with actual data)
INSERT INTO public.products (name, slug, description, category, brand, base_price, is_new)
VALUES (
  'Premium Leather Shoe',
  'premium-leather-shoe',
  'High-quality leather shoe with comfortable sole',
  'footwear',
  'Local Brand Co.',
  15000.00,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- SEED DATA: Nigerian State/LGA Delivery Rates
-- ============================================================================

INSERT INTO public.state_lga_rates (state, flat_fee, estimated_days) VALUES
('Lagos', 2500, 2),
('Ogun', 3000, 2),
('Oyo', 3500, 2),
('Osun', 3500, 3),
('Ekiti', 4000, 3),
('Ondo', 4000, 3),
('Kwara', 4500, 3),
('Kogi', 5000, 3),
('Abuja', 4000, 2),
('Nasarawa', 5500, 3),
('Niger', 5500, 3),
('Kaduna', 5000, 3),
('Katsina', 6000, 3),
('Kano', 6000, 3),
('Kebbi', 6500, 4),
('Zamfara', 6500, 4),
('Sokoto', 7000, 4),
('Jigawa', 6500, 4),
('Bauchi', 6000, 3),
('Gombe', 6000, 3),
('Yobe', 7000, 4),
('Adamawa', 6500, 3),
('Taraba', 6500, 3),
('Plateau', 5500, 3),
('Rivers', 4500, 2),
('Akwa Ibom', 4500, 2),
('Cross River', 5000, 3),
('Calabar', 4500, 2),
('Bayelsa', 4500, 2),
('Delta', 4000, 2),
('Edo', 3500, 2),
('Abia', 4000, 2),
('Imo', 4000, 2),
('Enugu', 4000, 2),
('Ebonyi', 4500, 3),
('Anambra', 4000, 2)
ON CONFLICT (state, lga) DO NOTHING;

-- ============================================================================
-- SEED DATA: Sample Discount Codes
-- ============================================================================

INSERT INTO public.discount_codes (code, type, value, first_order_only, expires_at) VALUES
('WELCOME15', 'percentage', 15, true, NOW() + INTERVAL '90 days'),
('SAVE5000', 'flat', 5000, false, NOW() + INTERVAL '30 days')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Database initialization complete!
-- Tables created:
-- 1. users
-- 2. products
-- 3. product_variants
-- 4. product_reviews
-- 5. orders
-- 6. order_items
-- 7. cart_items
-- 8. abandoned_carts
-- 9. saved_cards
-- 10. wishlists
-- 11. state_lga_rates
-- 12. discount_codes
-- 13. loyalty_log
-- 14. email_captures
--
-- All tables have RLS policies enabled and proper indexes created.
-- ============================================================================
