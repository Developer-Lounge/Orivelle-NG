# Implementation Notes

## Overview
This is a comprehensive e-commerce application built with React, TypeScript, and modern web technologies. The app has been extended from a single product page to a full-featured online store with multiple pages and advanced functionality.

## Architecture

### Routing
- **React Router v7** (Data Router mode) for client-side routing
- Routes defined in `src/app/routes.tsx`
- Layout-based routing with `RootLayout` as the parent

### State Management
- **Zustand** for global cart state with localStorage persistence
- Local component state for forms and UI interactions

### Validation
- **Zod** for runtime schema validation on forms
- Inline error display with accessible error messages

## Features Implemented

### 1. Promo Announcement Bar
**Location:** `src/app/components/PromoBar.tsx`

- Auto-rotating promotional messages (5-second intervals)
- Countdown timer for time-limited offers
- Dismissible with localStorage persistence
- Themeable background colors per promo
- Dot indicators for multiple promos

**Data source:** `src/data/promos.json`

### 2. Enhanced Header
**Location:** `src/app/layouts/RootLayout.tsx`

- Sticky header with search bar and cart icon
- Integrated search functionality with live results

**Search Bar:** `src/app/components/SearchBar.tsx`
- Debounced search (300ms) for performance
- Dropdown results with product images, names, prices
- Keyboard navigation (↑↓ arrows, Enter, Escape)
- Click-outside to close
- Real-time filtering against `products.json`

**TODO:** Replace static product filtering with API endpoint
```typescript
// Example API integration:
const response = await fetch(`/api/products/search?q=${query}`);
const results = await response.json();
```

### 3. Landing Page
**Location:** `src/app/pages/HomePage.tsx`

Sections in order:

**a. Hero Carousel** (`src/app/components/HeroCarousel.tsx`)
- 4 auto-playing slides (5-second intervals)
- Framer Motion slide transitions
- Prev/Next arrow controls
- Dot indicators
- Gradient overlay on images
- CTA buttons with links

**Data source:** `src/data/hero-slides.json`

**b. Category Grid** (`src/app/components/CategoryGrid.tsx`)
- 8 category cards with Lucide icons
- Hover effects with color transitions
- Click to filter products (handler passed as prop)

**Data source:** `src/data/categories.json`

**c. Flash Sale Product Grid** (`src/app/components/ProductGrid.tsx`)
- Countdown timer on flash sale items
- Discount badges (-35%)
- Star ratings (simulated)
- Add to cart from grid
- Skeleton loading states

**d. Advert Banners** (`src/app/components/AdvertBanner.tsx`)
- 3 promotional banners in responsive grid
- Image overlays with CTAs
- Hover animations (scale + opacity)

**e. More to Explore**
- Secondary product grid below banners

### 4. Product Detail Page
**Location:** `src/app/pages/ProductPage.tsx`

Refactored from original `App.tsx` with routing support:
- Image gallery with zoom and thumbnails
- Variant selector (color swatches + size grid)
- Stock validation and out-of-stock handling
- Quantity picker with max validation
- Mobile sticky add-to-cart bar
- Product features list
- Trust badges (shipping, returns, warranty)

**TODO:** Use `useParams()` to fetch product by slug
```typescript
const { slug } = useParams();
const product = await fetchProductBySlug(slug);
```

### 5. Authentication Pages

**Sign Up** (`src/app/pages/auth/SignUpPage.tsx`)
- Fields: full name, email, phone, password, confirm password
- Zod validation schema with inline errors
- Password strength indicator (Weak/Medium/Strong)
- Password visibility toggles
- "Already have an account?" link to sign in

**TODO:** Wire up user registration API
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(validatedData),
});
```

**Sign In** (`src/app/pages/auth/SignInPage.tsx`)
- Fields: email, password
- Zod validation
- Password visibility toggle
- "Forgot password?" link (placeholder)
- "Continue with Google" button (UI only)

**TODO:** Implement authentication flow
```typescript
// Standard auth:
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Google OAuth:
window.location.href = '/api/auth/google';
```

### 6. Checkout Page
**Location:** `src/app/pages/CheckoutPage.tsx`

Single-page checkout (no multi-step wizard):

**Left Column: Delivery Address**
- Full name, phone, email
- Street address, city, state, postal code
- Nigerian states dropdown (37 states)
- "Save address for future orders" checkbox
- Zod validation on all fields

**Right Column: Order Summary**
- Cart items with images and variant details
- Inline quantity editing
- Remove item button
- Subtotal, delivery fee, discount code input, total
- Free delivery over $100

**Payment Method Section**
- 3 payment options: Paystack, Flutterwave, Cash on Delivery
- Radio button cards with icons
- Visual selection state

**Place Order Button**
- Full-width CTA
- Validates entire form before submission
- Clears cart on success

**TODO:** Integrate payment gateways

**Paystack:**
```typescript
const response = await fetch('/api/payment/paystack/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: total * 100, // Paystack uses kobo
    email: validatedData.email,
  }),
});
const { authorization_url } = await response.json();
window.location.href = authorization_url;
```

**Flutterwave:**
```typescript
const response = await fetch('/api/payment/flutterwave/initialize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: total,
    email: validatedData.email,
  }),
});
const { link } = await response.json();
window.location.href = link;
```

**Cash on Delivery:**
```typescript
await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...validatedData,
    items,
    total,
    paymentMethod: 'cod',
  }),
});
```

## Data Structure

### Products (`src/data/products.json`)
Currently has 1 product (running shoes) with 12 variants.

**TODO:** Expand product catalog
- Add more product categories (electronics, fashion, beauty, etc.)
- Each product needs: id, slug, name, brand, description, category, features, variants array

### Categories (`src/data/categories.json`)
8 categories with Lucide icon names.

### Promos (`src/data/promos.json`)
3 promotional messages with optional countdown timers.

### Hero Slides (`src/data/hero-slides.json`)
4 carousel slides with images, titles, CTAs.

### Nigerian States (`src/data/nigerian-states.json`)
37 states for checkout address dropdown.

## Component Reuse

Existing components used across new pages:
- `CartDrawer` — global cart sidebar
- `QuantityInput` — stepper with validation
- `ImageGallery` — product images with zoom
- `VariantSelector` — color + size picker
- `ProductCard` — grid item with add-to-cart

New reusable components:
- `PromoBar` — rotating announcements
- `SearchBar` — live search with dropdown
- `HeroCarousel` — auto-playing image slider
- `CategoryGrid` — icon-based category cards
- `ProductGrid` — masonry/grid layout with skeletons
- `AdvertBanner` — promotional image blocks

## Styling

- **Tailwind CSS v4** for utility-first styling
- **Framer Motion** for page transitions, scroll reveals, drawer animations
- **Custom CSS** for slick-carousel base styles (`src/styles/slick.css`)
- **Responsive:** Mobile-first design with `lg:` breakpoints

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation in search dropdown
- Focus states on form inputs
- Error messages linked to inputs
- Semantic HTML (header, main, footer, nav)

## TypeScript

Strict typing throughout:
- Product, Variant, CartItem interfaces in `src/types/product.ts`
- Zod schemas inferred to form data types
- No `any` types used

## Future Backend Integration

All areas marked with `// TODO:` comments indicate where real backend/API calls should replace mock data:

1. **Search** — `/api/products/search`
2. **Product Fetch** — `/api/products/:slug`
3. **Authentication** — `/api/auth/signup`, `/api/auth/signin`, OAuth flows
4. **Payment Gateways** — Paystack and Flutterwave initialization endpoints
5. **Order Creation** — `/api/orders` for placing orders
6. **Address Save** — `/api/users/addresses` for storing delivery info

## Testing Checklist

- [ ] Homepage hero carousel auto-plays and responds to arrow clicks
- [ ] Search bar filters products and allows keyboard navigation
- [ ] Category clicks filter product grid (when handler wired up)
- [ ] Flash sale countdown timer updates in real-time
- [ ] Product page variants update images and stock correctly
- [ ] Sign up form validates all fields and shows errors
- [ ] Sign in form validates credentials
- [ ] Checkout validates address fields and payment method selection
- [ ] Cart persists across page refreshes
- [ ] Mobile sticky bars appear on product and checkout pages
- [ ] Promo bar dismisses and stays dismissed via localStorage

## Performance Considerations

- Debounced search input (300ms)
- Skeleton loading states for product grids
- Framer Motion animations use GPU-accelerated transforms
- Cart state persisted to localStorage (auto-synced)
- Images use Unsplash CDN with `w=800&q=80` optimization

## Known Limitations

- **Single product in catalog** — needs expansion for realistic demo
- **No user authentication state** — forms submit but don't maintain session
- **Mock payment flows** — need real gateway integration
- **Category filtering** — handler exists but not wired to product grid
- **Discount codes** — UI present but validation not implemented

## Deployment Notes

This is a Vite/React app designed for the Figma Make environment, not Next.js:
- Uses React Router (not Next.js App Router)
- Client-side routing only
- No server-side rendering
- Static JSON files instead of database

For production, you would:
1. Replace JSON files with database queries
2. Add API routes for search, products, auth, payments
3. Implement session management (JWT or cookies)
4. Add image uploads for user-generated content
5. Set up payment webhook handlers for Paystack/Flutterwave
6. Configure CORS and environment variables
