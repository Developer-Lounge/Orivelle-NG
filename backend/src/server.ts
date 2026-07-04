import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { env } from './config/env.js';
import { authMiddleware, requireAuth, requireAdmin } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import { authRoutes } from './routes/auth.js';
import { productsRoutes } from './routes/products.js';
import { cartRoutes } from './routes/cart.js';
import { ordersRoutes } from './routes/orders.js';
import { reviewsRoutes } from './routes/reviews.js';
import { deliveryRoutes } from './routes/delivery.js';
import { paystackWebhookRoutes } from './routes/webhooks/paystack.js';

const app = express();

// Middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Auth middleware (optional - some routes will require it)
app.use(authMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/delivery', deliveryRoutes);

// Webhooks (placed before auth requirement check)
app.use('/api/webhooks/paystack', paystackWebhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Orivelle Backend API                  ║
║   Running on http://localhost:${PORT}     ║
║   Environment: ${env.NODE_ENV}             ║
╚════════════════════════════════════════╝
  `);
});
