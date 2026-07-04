import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/reviews
 * Create a review for a product (with optional photo upload to Cloudinary)
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { product_id, rating, title, text, images } = req.body;

  if (!product_id || !rating || !title || !text) {
    throw new ApiError(400, 'product_id, rating, title, and text are required');
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, 'rating must be between 1 and 5');
  }

  // TODO: Upload images to Cloudinary (if provided)
  // TODO: Create review in database
  // TODO: Verify "verified_purchase" badge (check if user has purchased this product)

  res.status(201).json({
    message: 'Create review - endpoint skeleton',
    userId: req.user?.id,
  });
});

/**
 * GET /api/reviews/:product_id
 * Get reviews for a product
 */
router.get('/:product_id', async (req, res) => {
  const { product_id } = req.params;
  const { page = '1', limit = '10' } = req.query;

  // TODO: Fetch reviews from database with pagination
  res.json({
    message: 'Get reviews - endpoint skeleton',
    productId: product_id,
  });
});

/**
 * PUT /api/reviews/:review_id
 * Update review (own reviews only)
 */
router.put('/:review_id', requireAuth, async (req: AuthRequest, res) => {
  const { review_id } = req.params;
  const { rating, title, text, images } = req.body;

  // TODO: Verify ownership
  // TODO: Update review in database
  res.json({
    message: 'Update review - endpoint skeleton',
    reviewId: review_id,
  });
});

/**
 * DELETE /api/reviews/:review_id
 * Delete review (own reviews only)
 */
router.delete('/:review_id', requireAuth, async (req: AuthRequest, res) => {
  const { review_id } = req.params;

  // TODO: Verify ownership
  // TODO: Delete from database
  res.json({
    message: 'Delete review - endpoint skeleton',
    reviewId: review_id,
  });
});

/**
 * POST /api/reviews/:review_id/helpful
 * Mark review as helpful
 */
router.post('/:review_id/helpful', async (req, res) => {
  const { review_id } = req.params;

  // TODO: Increment helpful_count in database
  res.json({
    message: 'Mark review as helpful - endpoint skeleton',
    reviewId: review_id,
  });
});

export { router as reviewsRoutes };
