import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/cart
 * Get user's cart (requires auth)
 */
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  // TODO: Fetch cart items from database
  res.json({
    message: 'Get cart - endpoint skeleton',
    userId: req.user?.id,
  });
});

/**
 * POST /api/cart
 * Add item to cart
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { variant_id, quantity } = req.body;

  if (!variant_id || !quantity) {
    throw new ApiError(400, 'variant_id and quantity are required');
  }

  // TODO: Add to database cart_items
  res.status(201).json({
    message: 'Add to cart - endpoint skeleton',
    userId: req.user?.id,
  });
});

/**
 * PUT /api/cart/:item_id
 * Update cart item quantity
 */
router.put('/:item_id', requireAuth, async (req: AuthRequest, res) => {
  const { quantity } = req.body;

  if (!quantity) {
    throw new ApiError(400, 'quantity is required');
  }

  // TODO: Update database cart_items
  res.json({ message: 'Update cart item - endpoint skeleton' });
});

/**
 * DELETE /api/cart/:item_id
 * Remove item from cart
 */
router.delete('/:item_id', requireAuth, async (req: AuthRequest, res) => {
  // TODO: Delete from database cart_items
  res.json({ message: 'Remove from cart - endpoint skeleton' });
});

/**
 * DELETE /api/cart
 * Clear entire cart
 */
router.delete('/', requireAuth, async (req: AuthRequest, res) => {
  // TODO: Clear all cart_items for user
  res.json({ message: 'Clear cart - endpoint skeleton' });
});

export { router as cartRoutes };
