import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/signup
 * Create new user account via Supabase
 */
router.post('/signup', async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // TODO: Integrate with Supabase Auth
  // const { user, error } = await supabaseAdmin.auth.signUp({
  //   email,
  //   password,
  //   options: {
  //     data: { full_name }
  //   }
  // });

  res.status(201).json({
    message: 'Auth signup - endpoint skeleton. Implement Supabase auth.',
  });
});

/**
 * POST /api/auth/signin
 * Sign in user with email/password
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // TODO: Integrate with Supabase Auth
  // const { user, session, error } = await supabaseAdmin.auth.signInWithPassword({
  //   email,
  //   password,
  // });

  res.json({
    message: 'Auth signin - endpoint skeleton. Implement Supabase auth.',
  });
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', requireAuth, async (req, res) => {
  // TODO: Invalidate session
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export { router as authRoutes };
