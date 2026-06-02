# Orivelle - Full-Featured E-Commerce Platform

A production-ready e-commerce web application built with React, TypeScript, and modern UI patterns. This project demonstrates enterprise-level e-commerce patterns including multi-page navigation, user authentication, payment integration, variant management, persistent cart state, responsive design, and polished micro-interactions.

## 🎯 Key Features

### Multi-Page Application
- **Landing Page** - Jumia-style homepage with hero carousel, category grid, flash sales, and product grids
- **Product Detail Pages** - Variant selection, image galleries, stock management
- **Authentication** - Sign up and sign in pages with validation
- **Checkout Flow** - Single-page checkout with address, payment, and order summary
- **Dynamic Routing** - React Router v7 with layout-based routing

### Core E-Commerce Patterns
- **Promo Announcement Bar** - Auto-rotating promotional messages with countdown timers
- **Live Search** - Debounced search-as-you-type with dropdown results and keyboard navigation
- **Multi-variant Product System** - Color and size selection with real-time stock validation
- **Persistent Shopping Cart** - Global cart state with localStorage persistence via Zustand
- **Dynamic Inventory Management** - Stock-based disabled states and low-stock warnings
- **Image Gallery** - Thumbnail navigation, keyboard controls, and lightbox zoom
- **Responsive Design** - Mobile-first layout with sticky add-to-cart bars

### User Experience
- **Smooth Animations** - Framer Motion for page transitions, carousels, drawers, and scroll reveals
- **Form Validation** - Zod schemas with inline error messages and real-time validation
- **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- **Edge Case Handling** - Out-of-stock notifications, low-stock warnings, password strength indicators
- **Professional Polish** - Hover states, skeleton loading, visual feedback on all interactions

### Payment Integration (UI Ready)
- **Paystack** - Card payment integration placeholder
- **Flutterwave** - Multi-payment method integration placeholder
- **Cash on Delivery** - COD option for Nigerian market

## 🏗️ Architecture

### Tech Stack
- **React 18** - Component architecture with hooks
- **TypeScript** - Strict typing throughout (Product, Variant, CartItem, form data)
- **React Router v7** - Data Router mode for client-side routing
- **Zustand** - Lightweight state management with persistence middleware
- **Zod** - Runtime schema validation for forms
- **Framer Motion** - Animation library for polished UI transitions
- **Tailwind CSS v4** - Utility-first styling
- **Vite** - Fast development and optimized builds
- **date-fns** - Date formatting and countdown timers

### Project Structure
```
src/
├── app/
│   ├── components/
│   │   ├── PromoBar.tsx          # Rotating announcement bar
│   │   ├── SearchBar.tsx         # Live search with dropdown
│   │   ├── HeroCarousel.tsx      # Auto-playing banner carousel
│   │   ├── CategoryGrid.tsx      # Category navigation cards
│   │   ├── ProductCard.tsx       # Grid item with ratings & CTA
│   │   ├── ProductGrid.tsx       # Masonry layout with skeletons
│   │   ├── AdvertBanner.tsx      # Promotional image blocks
│   │   ├── ImageGallery.tsx      # Image viewer with zoom
│   │   ├── VariantSelector.tsx   # Color swatches & size picker
│   │   ├── CartDrawer.tsx        # Slide-in cart with animations
│   │   └── QuantityInput.tsx     # Stepper with validation
│   ├── layouts/
│   │   └── RootLayout.tsx        # App shell with header/footer
│   ├── pages/
│   │   ├── HomePage.tsx          # Landing page
│   │   ├── ProductPage.tsx       # Product detail page
│   │   ├── CheckoutPage.tsx      # Checkout & payment
│   │   ├── NotFoundPage.tsx      # 404 page
│   │   └── auth/
│   │       ├── SignUpPage.tsx    # User registration
│   │       └── SignInPage.tsx    # User login
│   ├── routes.tsx                # React Router configuration
│   └── App.tsx                   # RouterProvider entry
├── store/
│   └── cartStore.ts              # Zustand cart with persistence
├── types/
│   └── product.ts                # TypeScript interfaces
└── data/
    ├── products.json             # Product catalog
    ├── promos.json               # Promo bar messages
    ├── categories.json           # Category definitions
    ├── hero-slides.json          # Carousel slides
    └── nigerian-states.json      # State dropdown options
```

## 💡 Design Decisions

### Why Zustand over Redux?
For a product page with cart functionality, Zustand provides:
- 90% less boilerplate than Redux
- Built-in persistence middleware
- Simple API that's easier to maintain
- Better performance for this scope

### Why Static Data?
Using `products.json` instead of a backend API:
- Faster initial development and prototyping
- Perfect for portfolio/demo purposes
- Easy to swap for real API later
- No server costs for hosting demos

### Why Slide-in Cart Drawer?
Modern e-commerce sites (Shopify, Nike, Apple) use drawers instead of cart pages because:
- Keeps users in the shopping flow
- Better mobile experience
- Feels more responsive and modern
- Reduces friction in the purchase journey

### Mobile-First Considerations
- Sticky bottom bar on mobile for easy cart access
- Touch-friendly size selectors (44px+ tap targets)
- Optimized image loading with responsive sources
- Drawer animation tuned for mobile performance

## 🎨 Portfolio-Worthy Details

1. **Niche Specificity** - Running shoes with authentic features (CloudFoam, carbon fiber plate)
2. **Real-World Edge Cases** - Out-of-stock handling, low-stock warnings, variant availability
3. **Professional Animation** - Subtle motion that enhances UX without being distracting
4. **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
5. **TypeScript Throughout** - Demonstrates type safety and professional code practices

## 🚀 Getting Started

This project uses **pnpm** as the package manager:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available in the Figma Make preview panel.

## 📍 Routes

- `/` - Landing page with hero, categories, flash sales, and product grids
- `/product/:slug` - Product detail page (currently only `/product/cloud-runner-pro`)
- `/auth/signup` - User registration
- `/auth/signin` - User login
- `/checkout` - Checkout and payment
- `*` - 404 Not Found page

## 🔧 Customization

### Adding New Products
Edit `src/data/products.json` to add new products. Each product requires:
- Unique ID and slug
- Brand, name, description, category
- Array of variants (color + size combinations)
- Stock levels per variant
- Image URLs (4 per variant for the gallery)
- Features array

### Managing Promotions
Edit `src/data/promos.json` to update the promo bar:
- Add/remove promotional messages
- Set countdown timers with `endDate` (ISO format)
- Customize background and text colors per promo

### Hero Carousel
Edit `src/data/hero-slides.json` to change banner slides:
- Upload new images (or use Unsplash URLs)
- Update titles, subtitles, and CTA text/links

### Categories
Edit `src/data/categories.json` to modify category navigation:
- Add/remove categories
- Change Lucide icon names (must match exported icons in `CategoryGrid.tsx`)

### Changing Colors/Styles
The project uses Tailwind CSS v4. Edit `src/styles/theme.css` for global design tokens.

### Extending Cart Features
The cart store (`src/store/cartStore.ts`) is built with Zustand and supports:
- Add/remove items
- Quantity updates
- Persistent storage
- Easy to extend with promo codes, saved items, wishlists, etc.

## 📱 Features by Breakpoint

### Desktop (lg+)
- Two-column layout with sticky product details
- Full-size image gallery with thumbnails
- Inline "Add to Cart" and action buttons

### Mobile (<lg)
- Single column layout
- Sticky bottom bar with price and "Add to Cart"
- Touch-optimized variant selectors
- Full-screen cart drawer

## 🎓 Learning Outcomes

This project demonstrates:
- State management patterns (global cart vs local component state)
- TypeScript interface design for complex data structures
- Responsive design without media query hell
- Animation best practices with Framer Motion
- Accessibility considerations in modern web apps
- Project organization for maintainability

## 🔌 Backend Integration

All areas marked with `// TODO:` comments indicate where real backend/API calls should replace mock data. See `IMPLEMENTATION_NOTES.md` for detailed integration points.

### Key Integration Areas

1. **Search** - Replace static filtering with `/api/products/search`
2. **Authentication** - Wire up `/api/auth/signup` and `/api/auth/signin`
3. **Product Fetching** - Use `useParams()` to fetch `/api/products/:slug`
4. **Payment Gateways** - Initialize Paystack/Flutterwave with backend endpoints
5. **Order Creation** - Post order data to `/api/orders`

Example Paystack integration:
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

## 📝 Notes

- Images are sourced from Unsplash for demo purposes
- Cart persists across page refreshes using localStorage
- Stock levels are simulated; in production, sync with backend
- Payment UI is complete but needs backend integration
- Form validation uses Zod for runtime type safety
- All passwords should be hashed on the backend (never store plain text)

## 🧪 Testing Checklist

See `IMPLEMENTATION_NOTES.md` for a comprehensive testing checklist.

---

Built as a portfolio piece to demonstrate production-ready e-commerce patterns including multi-page navigation, authentication flows, payment integration, and advanced UI patterns. Code is intentionally well-documented with TODO comments showing exactly where backend integration should occur.
