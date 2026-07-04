import { Router } from 'express';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * POST /api/delivery/calculate-fee
 * Calculate delivery fee based on state and optional LGA
 * 
 * Body: { state: string, lga?: string }
 */
router.post('/calculate-fee', async (req, res) => {
  const { state, lga } = req.body;

  if (!state) {
    throw new ApiError(400, 'State is required');
  }

  // TODO: Implement pluggable logistics provider
  // For now, return a static fee based on state
  // Later: call active provider's calculateFee() method

  // Placeholder: flat fee based on state
  const stateFees: Record<string, number> = {
    'Lagos': 2500,
    'Ogun': 3000,
    'Oyo': 3500,
    'Osun': 3500,
    'Ekiti': 4000,
    'Ondo': 4000,
    'Kwara': 4500,
    'Kogi': 5000,
    'Abuja': 4000,
    'Nasarawa': 5500,
    'Niger': 5500,
    'Kaduna': 5000,
    'Katsina': 6000,
    'Kano': 6000,
    'Kebbi': 6500,
    'Zamfara': 6500,
    'Sokoto': 7000,
    'Jigawa': 6500,
    'Bauchi': 6000,
    'Gombe': 6000,
    'Yobe': 7000,
    'Adamawa': 6500,
    'Taraba': 6500,
    'Plateau': 5500,
    'Rivers': 4500,
    'Akwa Ibom': 4500,
    'Cross River': 5000,
    'Calabar': 4500,
    'Bayelsa': 4500,
    'Delta': 4000,
    'Edo': 3500,
    'Abia': 4000,
    'Imo': 4000,
    'Enugu': 4000,
    'Ebonyi': 4500,
    'Anambra': 4000,
  };

  const fee = stateFees[state] || 5000; // Default: ₦5000 for unknown states

  res.json({
    state,
    lga: lga || null,
    flat_fee: fee,
    per_km_fee: 0,
    estimated_days: 2,
    total_fee: fee,
  });
});

export { router as deliveryRoutes };
