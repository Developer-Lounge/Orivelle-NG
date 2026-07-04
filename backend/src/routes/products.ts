import { Router } from 'express';
import { supabaseAdmin } from '../config/database.js';
import { ApiError } from '../middleware/errorHandler.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/products
 * Get all products with optional filtering and pagination
 */
router.get('/', async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort = 'created_at',
    order = 'desc',
    page = '1',
    limit = '20',
    include_variants = 'false',
  } = req.query;

  try {
    let query = supabaseAdmin
      .from('products')
      .select(include_variants === 'true' ? '*, product_variants(*)' : '*');

    // Filters
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (minPrice) {
      query = query.gte('base_price', parseFloat(minPrice as string));
    }

    if (maxPrice) {
      query = query.lte('base_price', parseFloat(maxPrice as string));
    }

    // Sorting
    query = query.order(sort as string, { ascending: order === 'asc' });

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const pageSize = Math.min(100, Math.max(1, parseInt(limit as string)));
    const start = (pageNum - 1) * pageSize;

    query = query.range(start, start + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new ApiError(400, 'Failed to fetch products', error);
    }

    res.json({
      data,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        pages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err: any) {
    throw new ApiError(500, 'Failed to fetch products', err.message);
  }
});

/**
 * GET /api/products/:id
 * Get single product with variants and reviews
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (productError || !product) {
      throw new ApiError(404, 'Product not found');
    }

    // Fetch variants
    const { data: variants, error: variantsError } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id);

    if (variantsError) {
      throw new ApiError(500, 'Failed to fetch variants', variantsError.message);
    }

    // Fetch reviews
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('product_reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (reviewsError) {
      throw new ApiError(500, 'Failed to fetch reviews', reviewsError.message);
    }

    res.json({
      ...product,
      variants,
      reviews: reviews || [],
      review_count: reviews?.length || 0,
      average_rating:
        reviews && reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : null,
    });
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to fetch product', err.message);
  }
});

/**
 * GET /api/products/:id/reviews
 * Get all reviews for a product (paginated)
 */
router.get('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNum = Math.max(1, parseInt(page as string));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string)));
    const start = (pageNum - 1) * pageSize;

    const { data: reviews, error, count } = await supabaseAdmin
      .from('product_reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .range(start, start + pageSize - 1);

    if (error) {
      throw new ApiError(400, 'Failed to fetch reviews', error);
    }

    res.json({
      data: reviews,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        pages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to fetch reviews', err.message);
  }
});

export { router as productsRoutes };
