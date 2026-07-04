# Orivelle Backend API

Express.js + TypeScript backend for Orivelle e-commerce platform.

## Quick Start

```bash
# Install
npm install

# Setup env
cp .env.example .env
# Edit .env with your Supabase credentials

# Run dev
npm run dev

# Build
npm run build

# Start production
npm start
```

## API Documentation

### Base URL
Development: `http://localhost:3001/api`
Production: `https://api.orivelle.com/api`

### Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

Tokens come from Supabase Auth (frontend).

### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "..." }
```

---

## Endpoints (Phase 1)

### Products
- `GET /products` - List all products (paginated, filterable)
- `GET /products/:id` - Get product by ID or slug (includes variants + reviews)
- `GET /products/:id/reviews` - Get product reviews (paginated)

### Orders
- `POST /orders` - Create new order (guest or authenticated)
- `GET /orders` - Get user's orders (requires auth)
- `GET /orders/:id` - Get order details (requires auth or guest email match)
- `PUT /orders/:id/status` - Update order status (admin only)

### Reviews
- `POST /reviews` - Create review (requires auth, with photo upload)
- `GET /reviews/:product_id` - Get product reviews
- `PUT /reviews/:review_id` - Update own review (requires auth)
- `DELETE /reviews/:review_id` - Delete own review (requires auth)
- `POST /reviews/:review_id/helpful` - Mark review as helpful

### Delivery
- `POST /delivery/calculate-fee` - Calculate delivery fee by state/LGA

### Auth (Skeleton - connect to Supabase)
- `POST /auth/signup` - Create account
- `POST /auth/signin` - Login
- `POST /auth/logout` - Logout (requires auth)
- `GET /auth/me` - Get current user (requires auth)

### Webhooks
- `POST /webhooks/paystack` - Paystack payment callback (Week 2-3)

---

## Architecture

### Directory Structure
```
src/
  config/
    env.ts          - Environment variables
    database.ts     - Supabase client setup
  
  middleware/
    auth.ts         - JWT auth + role checking
    errorHandler.ts - Global error handler
  
  routes/
    auth.ts         - Auth endpoints
    products.ts     - Product endpoints
    cart.ts         - Cart endpoints (skeleton)
    orders.ts       - Order endpoints
    reviews.ts      - Review endpoints
    delivery.ts     - Delivery fee calculation
    webhooks/
      paystack.ts   - Paystack webhook
  
  services/
    (will add: paystack.ts, email.ts, cloudinary.ts in Week 2-3)
  
  types/
    index.ts        - TypeScript interfaces
  
  server.ts         - Express app setup
```

### Middleware Stack
1. CORS - Allow frontend requests
2. JSON parser - Parse request bodies
3. Auth middleware - Optional auth (adds `req.user` if token present)
4. Route handlers
5. Error handler - Catch and format errors

### Database
- Supabase PostgreSQL
- 14 tables with RLS policies
- See `database.sql` for full schema

### Error Handling
All errors return standardized JSON:
```json
{
  "error": {
    "status": 400,
    "message": "Error description",
    "details": {...} // Only in development
  }
}
```

---

## Environment Variables

Required:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Admin key for backend operations
- `JWT_SECRET` - Secret for JWT verification (min 32 chars)

Optional (Week 2-3):
- `PAYSTACK_SECRET_KEY` - Paystack secret
- `RESEND_API_KEY` - Email service
- `MAILGUN_*` - Backup email
- `CLOUDINARY_*` - Image uploads

---

## Development Workflow

### Week 1-2: Foundation
- ✅ Database schema
- ✅ API skeleton
- ✅ Auth middleware
- 🔜 Implement product/review/order endpoints
- 🔜 Connect to Supabase queries

### Week 2-3: Payments
- 🔜 Paystack SDK integration
- 🔜 Payment webhook handler
- 🔜 Order confirmation email

### Week 3-4: Logistics
- 🔜 Delivery fee API
- 🔜 Pluggable provider pattern
- 🔜 Order tracking webhook

---

## Testing

### Manual Testing
```bash
# Check API is running
curl http://localhost:3001/health

# Get products
curl http://localhost:3001/api/products

# Get product by slug
curl http://localhost:3001/api/products/premium-leather-shoe

# Calculate delivery fee
curl -X POST http://localhost:3001/api/delivery/calculate-fee \
  -H "Content-Type: application/json" \
  -d '{"state": "Lagos"}'
```

### With Auth Token
```bash
# Get current user (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/me
```

---

## Production Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy on push to main

### Docker
```bash
docker build -t orivelle-backend .
docker run -p 3001:3001 --env-file .env orivelle-backend
```

### Railway / Render / Fly.io
1. Connect GitHub repo
2. Set env vars
3. Deploy

---

## Debugging

Enable debug logs:
```bash
DEBUG=orivelle:* npm run dev
```

Check logs in Supabase dashboard:
1. Go to SQL Editor
2. View real-time logs of queries

---

## Contributing

All endpoints must:
- ✅ Have proper error handling
- ✅ Use TypeScript types
- ✅ Be documented with JSDoc
- ✅ Handle pagination for list endpoints
- ✅ Respect RLS policies (no direct admin queries in user endpoints)

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Paystack API Docs](https://paystack.com/docs/api)
