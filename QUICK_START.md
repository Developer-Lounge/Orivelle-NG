# Quick Reference: Phase 1 Setup Checklist

## 🎯 Before You Start
- [ ] Have Supabase account (free tier OK)
- [ ] Have Node.js 18+ installed
- [ ] Clone/have this project open

---

## 🔧 Setup (Follow in Order)

### Step 1: Create Supabase Project (5 min)
```bash
# Go to supabase.com → New Project
# Project name: orivelle
# Wait for initialization...
# Then go to Project Settings → API
# COPY THESE VALUES:
#   - Project URL → SUPABASE_URL https://xhkieacgxetldkqbflkz.supabase.co
#   - anon public key → SUPABASE_ANON_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhoa2llYWNneGV0bGRrcWJmbGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTg4NzksImV4cCI6MjA5ODY3NDg3OX0.8quFXbBM9_sMgLxyJ0eqpDOqwylkF-dNXHbBcA9pCcg
#   - service_role key → SUPABASE_SERVICE_ROLE_KEY eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhoa2llYWNneGV0bGRrcWJmbGt6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzA5ODg3OSwiZXhwIjoyMDk4Njc0ODc5fQ.abKR_shWga7X2x3QjgbwgniKrWs_HMeExWkRIiM-dP4
```

### Step 2: Deploy Database Schema (3 min)
```bash
# Supabase Dashboard → SQL Editor → New Query
# Copy entire content from:
#   ./backend/database.sql
# Paste into SQL Editor → Run
# Wait for ✅ completion
```

### Step 3: Setup Backend (10 min)
```bash
cd backend
npm install

# Create .env from template
cp .env.example .env

# Edit .env and fill in:
#   SUPABASE_URL=https://xxxxx.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
#   SUPABASE_ANON_KEY=eyJxxxxx...
#   JWT_SECRET=[generate random 32+ char string]
#   NODE_ENV=development
#   PORT=3001
#   FRONTEND_URL=http://localhost:5173

# Verify it works
npm run dev
# Should see: "Running on http://localhost:3001"
```

### Step 4: Setup Frontend (5 min)
```bash
cd ..  # Back to root

# Create .env.local from template
cp .env.example .env.local

# Edit .env.local and fill in:
#   VITE_BACKEND_URL=http://localhost:3001
#   VITE_SUPABASE_URL=https://xxxxx.supabase.co
#   VITE_SUPABASE_ANON_KEY=eyJxxxxx...

# Start frontend
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Step 5: Verify Everything (2 min)
```bash
# Keep both servers running in separate terminals

# Test 1: Open browser → http://localhost:5173
# Should load homepage ✅

# Test 2: Check backend
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}

# Test 3: Fetch products
curl http://localhost:3001/api/products
# Should return product list ✅
```

---

## ✅ Setup Complete Checklist

- [ ] Supabase project created
- [ ] `backend/database.sql` executed in Supabase
- [ ] Backend `.env` created with credentials
- [ ] Backend running on http://localhost:3001 ✅
- [ ] Frontend `.env.local` created with URLs
- [ ] Frontend running on http://localhost:5173 ✅
- [ ] `/health` endpoint returns OK
- [ ] `/api/products` returns data

**If all checked → Phase 1 Week 1-2 is READY! 🚀**

---

## 📚 Documentation Guide

Need help? Read these in order:

1. **Setup Issues?**
   → `PHASE1_SETUP_GUIDE.md` (Troubleshooting section)

2. **Understanding Architecture?**
   → `PHASE1_IMPLEMENTATION_GUIDE.md`

3. **API Endpoint Reference?**
   → `backend/README.md`

4. **What Was Built?**
   → `PHASE1_COMPLETE.md`

---

## 🚀 Next Steps (Week 2-3)

Once setup is done, we'll implement:
1. Paystack payment integration
2. Order creation endpoint
3. Guest checkout flow
4. Card tokenization
5. Email notifications

Ready? Let me know when you have both servers running! ✅

---

## 💡 Common Issues

### Backend won't start
```
Error: listen EADDRINUSE
→ Port 3001 already in use
→ Kill process: lsof -i :3001 | grep node | awk '{print $2}' | xargs kill -9
```

### Frontend can't connect to backend
```
CORS Error
→ Check VITE_BACKEND_URL in .env.local
→ Should be exactly: http://localhost:3001
→ Restart frontend after changing
```

### "Missing required environment variables"
```
→ Check backend .env has:
  - SUPABASE_URL (filled in)
  - SUPABASE_SERVICE_ROLE_KEY (filled in)
  - JWT_SECRET (min 32 chars)
```

### Database queries fail
```
→ Verify in Supabase SQL Editor:
  - Run: SELECT COUNT(*) FROM products;
  - Should return: 1 (sample product)
→ Check RLS policies are created
  - Go to Authentication → Policies
  - All tables should show ✅
```

---

## Command Reference

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Database management (if needed)
cd backend

# View database
npm run migrate status

# Reset database (careful!)
# Go to Supabase → Database → Clear all
```

---

**Status: Phase 1 Infrastructure Complete ✅**

All files created, documentation written, ready for Week 2-3 implementation!

