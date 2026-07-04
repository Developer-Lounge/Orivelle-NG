import { Router } from 'express';
import crypto from 'crypto';
import { env } from '../../config/env.js';
import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';
import crypto from 'crypto';
import { env } from '../../config/env.js';

const router = Router();

/**
 * POST /api/webhooks/paystack
 * Handle Paystack payment callbacks
 * 
 * Paystack will POST to this endpoint after payment is processed
 */
router.post('/', async (req, res) => {
  const signature = req.headers['x-paystack-signature'] as string | undefined;
  const raw = JSON.stringify(req.body || {});

  // Verify webhook signature
  if (!env.PAYSTACK_SECRET_KEY) {
    return res.status(500).send('Paystack secret not configured');
  }

  const expected = crypto.createHmac('sha512', env.PAYSTACK_SECRET_KEY).update(raw).digest('hex');

  if (!signature || signature !== expected) {
    return res.status(401).send('Invalid signature');
  }

  const { event, data } = req.body;

  try {
    if (event === 'charge.success') {
      const { reference, amount, customer } = data;

      // TODO: Update order status to 'confirmed'
      // TODO: Mark payment_reference as confirmed
      // TODO: Send confirmation email

      console.log(`Payment successful for reference: ${reference}, amount: ${amount}`);
      res.json({ status: 'ok' });
    } else {
      console.log(`Unhandled event: ${event}`);
      res.json({ status: 'ok' });
    }
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
