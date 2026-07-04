# Phase 1 Implementation Guide

## Tech Stack Confirmed

- **Frontend**: Vite + React + TypeScript (current stack)
- **Backend**: Node.js + Express/Hono, deployed to Vercel serverless or Railway
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **File Storage**: Cloudinary (images) + Supabase Storage (reviews, user uploads)
- **Email**: Resend (primary) + Mailgun (backup)
- **Webhooks**: Vercel serverless functions for Paystack callbacks
- **Analytics**: GA4

---

## Phase 1 Timeline (6-8 Weeks)

### Week 1-2: Backend Foundation & Database Schema
### Week 2-3: Paystack Integration + Guest Checkout
### Week 3-4: Logistics + Delivery States
### Week 4-5: Trust Signals (Reviews, Social Proof, Return Policy)
### Week 5-6: Inventory + Wishlist
### Week 6-7: Data Migration + Zustand→API Bridge
### Week 7-8: Testing + Performance

---

## Folder Structure (New Files)

```
src/
  api/                    # Vite API client
    client.ts            # Axios/fetch wrapper for backend calls
    auth.ts              # Auth API methods
    products.ts
    cart.ts
    orders.ts
    reviews.ts
    delivery.ts
    discounts.ts
  
  components/
    ReviewSection.tsx      # NEW
    ReviewModal.tsx        # NEW (photo upload)
    SocialProofToast.tsx   # NEW
    DeliveryFeeCalculator.tsx # NEW
    WishlistButton.tsx     # NEW
    LowStockIndicator.tsx  # NEW
    PolicyBanner.tsx       # NEW
    WhatsAppButton.tsx     # NEW
  
  lib/
    logistics/
      providers/
        index.ts
        staticProvider.ts     # NEW
        GIGLProvider.ts       # NEW (scaffold)
        KwikProvider.ts       # NEW (scaffold)
      interface.ts            # NEW
      factory.ts              # NEW
    auth/
      supabaseClient.ts       # NEW
      session.ts              # NEW
    validators/
      checkout.ts             # NEW (Zod schemas)
    constants/
      deliveryRates.ts        # NEW
  
  hooks/
    useSupabase.ts           # NEW
    useReviews.ts            # NEW
    useWishlist.ts           # NEW
    useAbandonedCart.ts       # NEW
  
  pages/
    account/
      WishlistPage.tsx        # NEW
    admin/                     # NEW (scaffold)
      DashboardPage.tsx
  
  store/
    reviewStore.ts           # NEW (Zustand)
    wishlistStore.ts         # NEW
    deliveryStore.ts         # NEW

backend/                      # NEW - Separate Node.js project
  src/
    middleware/
      auth.ts
      errorHandler.ts
    routes/
      auth.ts
      products.ts
      cart.ts
      orders.ts
      reviews.ts
      delivery.ts
      discounts.ts
      webhooks/
        paystack.ts
    services/
      supabase.ts
      paystack.ts
      email.ts
      cloudinary.ts
    types/
      index.ts
    config/
      database.ts
      env.ts
    server.ts
```

---

## 1. Database Schema (Supabase SQL)

```sql
-- Users (Extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'regular', -- 'regular', 'vip', 'pro'
  loyalty_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  is_flash_sale BOOLEAN DEFAULT FALSE,
  flash_sale_price DECIMAL(10, 2),
  flash_sale_end_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Variants (Color, Size, SKU)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  color_hex TEXT,
  size TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- JSON array of URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Reviews
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- Cloudinary URLs
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- One review per user per product
);

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT 'ORV-' || TO_CHAR(NOW(), 'YYYYMM') || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL, -- For guest checkout
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Shipping Address
  full_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT,
  postal_code TEXT,
  phone TEXT NOT NULL,
  
  -- Payment & Logistics
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'
  payment_method TEXT NOT NULL, -- 'paystack_card', 'paystack_transfer', 'cod'
  payment_reference TEXT UNIQUE, -- From Paystack
  payment_confirmed_at TIMESTAMP,
  
  logistics_provider TEXT DEFAULT 'static', -- For future API integration
  shipment_id TEXT,
  
  -- Discount
  discount_code_id UUID REFERENCES discount_codes(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  product_name TEXT NOT NULL,
  quantity INT NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL, -- Snapshot price
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shopping Carts
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, variant_id) -- One entry per user per variant
);

-- Abandoned Carts (for recovery)
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL, -- For guest abandonment
  cart_items JSONB NOT NULL, -- Snapshot of cart
  abandoned_at TIMESTAMP DEFAULT NOW(),
  last_recovered_at TIMESTAMP,
  recovery_count INT DEFAULT 0,
  recovered_order_id TEXT REFERENCES orders(id)
);

-- Saved Cards (for returning customers)
CREATE TABLE saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_token TEXT NOT NULL, -- From Paystack
  last4 TEXT NOT NULL,
  brand TEXT NOT NULL, -- 'visa', 'mastercard'
  exp_month INT,
  exp_year INT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wishlists
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- State & LGA Delivery Rates
CREATE TABLE state_lga_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  lga TEXT,
  flat_fee DECIMAL(10, 2) NOT NULL, -- ₦ amount
  per_km_fee DECIMAL(10, 2) DEFAULT 0,
  estimated_days INT DEFAULT 2,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state, lga)
);

-- Discount Codes
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'percentage', 'flat', 'first_order'
  value DECIMAL(10, 2) NOT NULL, -- percentage (e.g., 15) or flat amount (e.g., 5000)
  max_uses INT,
  current_uses INT DEFAULT 0,
  min_cart_value DECIMAL(10, 2),
  max_discount_value DECIMAL(10, 2),
  first_order_only BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Loyalty Points Log
CREATE TABLE loyalty_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points_amount INT NOT NULL,
  type TEXT NOT NULL, -- 'earn', 'redeem'
  related_order_id TEXT REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email Captures (for marketing)
CREATE TABLE email_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_order_discount_used BOOLEAN DEFAULT FALSE,
  captured_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_verified ON product_reviews(verified_purchase);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_state_rates ON state_lga_rates(state, lga);
CREATE INDEX idx_discount_codes ON discount_codes(code);
```

---

## 2. Environment Variables

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3001 # or https://your-api.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=orivelle_review_photos
VITE_GA4_ID=G-XXXXXXXXXX
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
```

### Backend (.env)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
SUPABASE_ANON_KEY=eyJxxxx...
DATABASE_URL=postgresql://user:pass@db.supabase.co:5432/postgres

PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx

RESEND_API_KEY=re_xxxxx
MAILGUN_API_KEY=mg_xxxxx
MAILGUN_DOMAIN=mg.orivelle.ng

CLOUDINARY_NAME=your_cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

JWT_SECRET=your_random_secret_key

NODE_ENV=production
```

---

## 3. Type Definitions (Frontend)

New files: `src/types/orders.ts`, `src/types/reviews.ts`, `src/types/auth.ts`

```typescript
// reviews.ts
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  text: string;
  images: string[]; // Cloudinary URLs
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  text: string;
  images: File[];
}

// orders.ts
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
  items: OrderItem[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'paystack_card' | 'paystack_transfer' | 'cod';

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  quantity: number;
  price_at_time: number;
}

// auth.ts
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  tier: 'regular' | 'vip' | 'pro';
  loyalty_points: number;
  created_at: string;
}

export interface AuthSession {
  user: User | null;
  session: { access_token: string; expires_at: number } | null;
}
```

---

## 4. Backend API Routes (Node.js + Express)

### Main endpoints by week:

**Week 1-2:**
- `POST /auth/signup` → Supabase Auth
- `POST /auth/signin` → Supabase Auth
- `GET /products` (paginated, filters)
- `GET /products/:id`
- `GET /delivery-fee` (state, lga → fee)

**Week 2-3:**
- `POST /orders` (create order, trigger Paystack)
- `POST /webhooks/paystack` (payment confirmation)
- `POST /orders/:id/payment-method` (save card token)

**Week 4-5:**
- `POST /reviews` (photo upload to Cloudinary)
- `GET /products/:id/reviews`

**Week 5-6:**
- `POST /wishlist` (add)
- `DELETE /wishlist/:id` (remove)
- `GET /user/wishlist`
- `PUT /products/:id/stock` (admin only)

---

## 5. Implementation Checklist

### Week 1-2: Backend + Database
- [ ] Set up Supabase project
- [ ] Run database schema SQL
- [ ] Seed initial products/categories
- [ ] Create backend project (Node + Express)
- [ ] Supabase Auth integration
- [ ] JWT middleware
- [ ] Products API (GET /products, GET /products/:id)
- [ ] Delivery fee API (POST /delivery-fee with state/lga logic)

### Week 2-3: Payments + Guest Checkout
- [ ] Paystack integration (key setup)
- [ ] Create order endpoint (POST /orders)
- [ ] Paystack webhook handler (Vercel serverless)
- [ ] Save card token endpoint
- [ ] Update CheckoutPage UI (guest + payment methods)
- [ ] Connect frontend to real API

### Week 3-4: Logistics + Tracking
- [ ] Seed state_lga_rates table (all Nigerian states)
- [ ] Logistics provider factory pattern
- [ ] Order status tracking page (enhanced)
- [ ] Webhook to update order status (placeholder for real API)

### Week 4-5: Reviews + Trust Signals
- [ ] ReviewSection + ReviewModal components
- [ ] Cloudinary integration (photo upload)
- [ ] POST /reviews endpoint
- [ ] "Verified Purchase" badge logic
- [ ] Social proof toast (simulate recent orders)
- [ ] Return policy page (expand ReturnsPage)
- [ ] WhatsApp button (add to product page + footer)

### Week 5-6: Inventory + Wishlist
- [ ] LowStockIndicator component
- [ ] Wishlist endpoints + UI
- [ ] WishlistPage
- [ ] Zustand wishlist store

### Week 6-7: Data Migration
- [ ] Import existing products.json to database
- [ ] Update auth store (Supabase session)
- [ ] Cart sync to database
- [ ] Order history sync

### Week 7-8: Testing + Polish
- [ ] E2E tests (Cypress/Playwright)
- [ ] Payment flow testing
- [ ] Performance audits
- [ ] Deployment to production

---

## Next Steps

Ready to start **Week 1**? I'll create:

1. **Backend project setup** (Express + Supabase + dotenv)
2. **SQL schema** (ready to paste into Supabase)
3. **Type definitions** (TypeScript interfaces)
4. **API client** (Axios wrapper for frontend)
5. **Supabase Auth** (Vite integration)
6. **First components** (ReviewSection, WishlistButton, etc.)

Let me know when you're ready! 🚀
