import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/database.js';
import paystackService from '../services/paystack.js';
import { env } from '../config/env.js';

const router = Router();

/**
 * POST /api/orders
 * Create new order and optionally initialize Paystack payment
 */
router.post('/', async (req: AuthRequest, res) => {
  const {
    email,
    full_name,
    street_address,
    city,
    state,
    lga,
    postal_code,
    phone,
    cart_items,
    payment_method,
    callback_url,
  } = req.body;

  const required = ['email', 'full_name', 'street_address', 'city', 'state', 'phone', 'cart_items', 'payment_method'];
  const missing = required.filter((f) => !req.body[f]);
  if (missing.length > 0) throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);

  if (!Array.isArray(cart_items) || cart_items.length === 0) {
    throw new ApiError(400, 'cart_items must be a non-empty array');
  }

  try {
    // 1. Fetch variant details to compute totals
    const variantIds = cart_items.map((it: any) => it.variant_id);
    const { data: variants, error: variantsError } = await supabaseAdmin
      .from('product_variants')
      .select('*')
      .in('id', variantIds as string[]);

    if (variantsError) throw new ApiError(500, 'Failed to fetch product variants', variantsError.message);

    // Fetch product names for display
    const productIds = Array.from(new Set((variants || []).map((v: any) => v.product_id)));
    const { data: products } = await supabaseAdmin.from('products').select('id, name').in('id', productIds as string[]);

    // Build order items and subtotal
    let subtotal = 0;
    const orderItems = cart_items.map((it: any) => {
      const variant = (variants || []).find((v: any) => v.id === it.variant_id);
      if (!variant) throw new ApiError(400, `Variant not found: ${it.variant_id}`);
      const product = (products || []).find((p: any) => p.id === variant.product_id) || { name: 'Product' };
      const price = Number(variant.price || variant.price_at_time || variant.price);
      const quantity = Number(it.quantity || 1);
      subtotal += price * quantity;
      return {
        variant_id: variant.id,
        product_name: product.name,
        quantity,
        price_at_time: price,
      };
    });

    // 2. Calculate delivery fee from state_lga_rates
    let deliveryFee = 0;
    const { data: rateByLga } = await supabaseAdmin
      .from('state_lga_rates')
      .select('*')
      .eq('state', state)
      .eq('lga', lga || null)
      .maybeSingle();

    if (rateByLga) {
      deliveryFee = Number(rateByLga.flat_fee || 0);
    } else {
      const { data: rateByState } = await supabaseAdmin
        .from('state_lga_rates')
        .select('*')
        .eq('state', state)
        .is('lga', null)
        .maybeSingle();
      deliveryFee = Number(rateByState?.flat_fee || 5000);
    }

    // 3. Apply discount if provided (simple placeholder)
    const discount_amount = 0;

    const total = subtotal + deliveryFee - discount_amount;

    // 4. Create order record
    const orderPayload: any = {
      user_id: req.user?.id || null,
      email,
      subtotal,
      delivery_fee: deliveryFee,
      discount_amount,
      total,
      full_name,
      street_address,
      city,
      state,
      lga: lga || null,
      postal_code: postal_code || null,
      phone,
      status: 'pending',
      payment_method,
    };

    const { data: createdOrder, error: orderError } = await supabaseAdmin.from('orders').insert(orderPayload).select().single();
    if (orderError) throw new ApiError(500, 'Failed to create order', orderError.message);

    // 5. Insert order items
    const itemsToInsert = orderItems.map((it: any) => ({ ...it, order_id: createdOrder.id }));
    const { error: orderItemsError } = await supabaseAdmin.from('order_items').insert(itemsToInsert);
    if (orderItemsError) throw new ApiError(500, 'Failed to create order items', orderItemsError.message);

    // 6. If Paystack payment, initialize transaction
    if (payment_method && payment_method.startsWith('paystack')) {
      const cb = callback_url || `${env.FRONTEND_URL}/payment/callback`;
      const paystackResp = await paystackService.initializeTransaction({
        email,
        amount: total,
        callback_url: cb,
        metadata: { order_id: createdOrder.id },
      });

      return res.status(201).json({ order: createdOrder, paystack: paystackResp });
    }

    // 7. Otherwise return created order
    res.status(201).json({ order: createdOrder });
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, 'Failed to create order', err.message || err);
  }
});

/**
 * GET /api/orders
 * Get user's orders
 */
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  // TODO: Fetch orders for user from database
  res.json({
    message: 'Get user orders - endpoint skeleton',
    userId: req.user?.id,
  });
});

/**
 * GET /api/orders/:id
 * Get single order details
 */
router.get('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;

  // TODO: Fetch order from database
  // TODO: If user is authenticated, verify ownership
  res.json({
    message: 'Get order details - endpoint skeleton',
    orderId: id,
  });
});

/**
 * PUT /api/orders/:id/status
 * Update order status (admin only)
 */
router.put('/:id/status', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // TODO: Verify admin role
  // TODO: Update order status in database
  res.json({
    message: 'Update order status - endpoint skeleton',
    orderId: id,
    status,
  });
});

export { router as ordersRoutes };
