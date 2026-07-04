# Phase 1 Setup Guide

## Overview
This guide walks you through setting up the Phase 1 infrastructure for Orivelle e-commerce.

## Prerequisites
- Node.js 18+
- npm/pnpm/yarn
- Supabase account (free tier works)
- Paystack account (for payment testing)
- Cloudinary account (for image uploads)

---

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Create new project:
   - Project name: `orivelle` (or your preference)
   - Database password: Save this securely
   - Region: Choose closest to Nigeria (or Europe)
4. Wait for project to initialize (2-5 minutes)

### 1.2 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire content from `backend/database.sql`
4. Paste into SQL Editor
5. Click "Run" (or Ctrl+Enter)
6. Wait for all tables to be created ✅

### 1.3 Get Credentials
1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (backend only)

### 1.4 Enable Row Level Security (RLS)
RLS policies are already created by the SQL schema, but verify:
1. Go to **Authentication** → **Policies**
2. Verify policies exist for each table
3. All should show ✅ next to table names

---

## Step 2: Set Up Backend

### 2.1 Install Dependencies
```bash
cd backend
npm install
# or: pnpm install
```

### 2.2 Create .env File
```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `SUPABASE_URL` - from Step 1.3
- `SUPABASE_SERVICE_ROLE_KEY` - from Step 1.3
- `SUPABASE_ANON_KEY` - from Step 1.3
- `JWT_SECRET` - generate random 32+ char string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NODE_ENV=development`
- `PORT=3001`
- `FRONTEND_URL=http://localhost:5173`

(Leave Paystack, Resend, etc. blank for now - we'll add these in Week 2-3)

### 2.3 Test Backend
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   Orivelle Backend API                  ║
║   Running on http://localhost:3001     ║
║   Environment: development             ║
╚════════════════════════════════════════╝
```

### 2.4 Test API Endpoint
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"2026-07-03T..."}
```

---

## Step 3: Set Up Frontend

### 3.1 Install Dependencies
```bash
cd ..  # Back to root
npm install
# or: pnpm install
```

### 3.2 Create .env.local
```bash
cp .env.example .env.local
```

Edit `.env.local`:
- `VITE_BACKEND_URL=http://localhost:3001`
- `VITE_SUPABASE_URL` - from Step 1.3
- `VITE_SUPABASE_ANON_KEY` - from Step 1.3
- Leave other values blank for now

### 3.3 Test Frontend Dev Server
```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Open http://localhost:5173 in browser → Should load homepage ✅

---

## Step 4: Connect Frontend to Backend

### 4.1 Verify API Client
The API client is pre-configured in `src/api/client.ts`:
- It points to `VITE_BACKEND_URL`
- Auto-injects auth token from Supabase session
- Handles 401 errors by redirecting to login

### 4.2 Test Product Fetching
Backend already seeds one sample product. To fetch:

1. Open browser console at http://localhost:5173
2. Run:
```javascript
fetch('http://localhost:3001/api/products')
  .then(r => r.json())
  .then(console.log)
```

You should see:
```json
{
  "data": [
    {
      "id": "...",
      "name": "Premium Leather Shoe",
      "slug": "premium-leather-shoe",
      ...
    }
  ],
  "pagination": {...}
}
```

---

## Step 5: Test Supabase Auth (Basic)

### 5.1 Enable Email Auth
1. In Supabase, go to **Authentication** → **Providers**
2. Email should be enabled by default
3. Confirm it shows "Enabled" with toggle on

### 5.2 Test with useAuth Hook
In any component:
```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isLoading, signUp, signIn } = useAuth();

  return <div>{user ? `Logged in: ${user.email}` : 'Not logged in'}</div>;
}
```

---

## Step 6: Seed Sample Data (Optional)

### 6.1 Add More Products
1. Go to Supabase **SQL Editor**
2. Create new query:
```sql
INSERT INTO products (name, slug, category, brand, base_price, is_new)
VALUES
  ('Classic T-Shirt', 'classic-t-shirt', 'clothing', 'Brand A', 5000, false),
  ('Running Shoes', 'running-shoes', 'footwear', 'Brand B', 25000, true),
  ('Backpack', 'backpack', 'accessories', 'Brand C', 8000, false);
```
3. Run query

---

## Checklist

- [ ] Supabase project created
- [ ] Database schema loaded (`backend/database.sql`)
- [ ] Supabase credentials copied to `.env` files
- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:5173
- [ ] `/api/health` endpoint returns OK
- [ ] Sample products visible in database
- [ ] useAuth hook available for auth flows

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is free
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Update .env with correct SUPABASE_URL
npm run dev
```

### "Missing required environment variables" error
Check backend `.env` has:
- `SUPABASE_URL` (not empty)
- `SUPABASE_SERVICE_ROLE_KEY` (not empty)
- `JWT_SECRET` (min 32 chars)

### API calls from frontend return 401
Frontend `.env.local` missing:
- `VITE_BACKEND_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### "CORS error" when calling API
Ensure backend `.env` has:
- `FRONTEND_URL=http://localhost:5173` (exact!)
- Restart backend after changing

---

## Next Steps (Week 1-2 Complete!)

✅ Backend API is ready
✅ Database schema is live
✅ Frontend can talk to backend
✅ Supabase Auth is configured

**Week 2-3 Focus:**
- Integrate Paystack payment processing
- Build order creation flow
- Implement guest checkout
- Add card tokenization

See `PHASE1_IMPLEMENTATION_GUIDE.md` for full roadmap.
