import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Package, Calendar, ArrowRight, Truck, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface TrackingStatusStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  active: boolean;
}

interface TrackingDetails {
  orderId: string;
  email: string;
  status: 'placed' | 'processing' | 'transit' | 'delivery' | 'delivered';
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  steps: TrackingStatusStep[];
}

const MOCK_TRACKING_DATA: Record<string, TrackingDetails> = {
  'ORV-12345': {
    orderId: 'ORV-12345',
    email: 'customer@example.com',
    status: 'transit',
    courier: 'FedEx Express',
    trackingNumber: 'FX-83921-9321',
    estimatedDelivery: 'June 5, 2026',
    steps: [
      { title: 'Order Placed', description: 'Your order has been received and is being processed.', date: 'June 1, 2026 - 10:24 AM', completed: true, active: false },
      { title: 'Processing', description: 'Payment confirmed. Items packed and handed over to courier.', date: 'June 2, 2026 - 02:15 PM', completed: true, active: false },
      { title: 'In Transit', description: 'Package departed shipping hub in Memphis, TN. In transit to destination.', date: 'June 3, 2026 - 08:30 AM', completed: true, active: true },
      { title: 'Out for Delivery', description: 'Package is loaded on delivery vehicle and will arrive today.', date: 'Pending', completed: false, active: false },
      { title: 'Delivered', description: 'Successfully signed and delivered to front porch.', date: 'Pending', completed: false, active: false }
    ]
  },
  'ORV-54321': {
    orderId: 'ORV-54321',
    email: 'test@example.com',
    status: 'delivered',
    courier: 'DHL Express',
    trackingNumber: 'DHL-98124-5231',
    estimatedDelivery: 'June 2, 2026 (Delivered)',
    steps: [
      { title: 'Order Placed', description: 'Your order has been received and is being processed.', date: 'May 28, 2026 - 09:12 AM', completed: true, active: false },
      { title: 'Processing', description: 'Payment confirmed. Items packed and handed over to courier.', date: 'May 29, 2026 - 11:30 AM', completed: true, active: false },
      { title: 'In Transit', description: 'Package departed shipping hub in Frankfurt, DE. In transit to destination.', date: 'May 30, 2026 - 04:45 PM', completed: true, active: false },
      { title: 'Out for Delivery', description: 'Package is loaded on delivery vehicle.', date: 'June 2, 2026 - 08:00 AM', completed: true, active: false },
      { title: 'Delivered', description: 'Successfully signed and delivered by agent.', date: 'June 2, 2026 - 03:22 PM', completed: true, active: true }
    ]
  },
  'ORV-99999': {
    orderId: 'ORV-99999',
    email: 'hello@example.com',
    status: 'processing',
    courier: 'USPS Ground Advantage',
    trackingNumber: 'US-84092-1209',
    estimatedDelivery: 'June 8, 2026',
    steps: [
      { title: 'Order Placed', description: 'Your order has been received and is being processed.', date: 'June 3, 2026 - 08:00 AM', completed: true, active: false },
      { title: 'Processing', description: 'We are packaging your items and preparing them for carrier pick up.', date: 'June 3, 2026 - 11:45 AM', completed: true, active: true },
      { title: 'In Transit', description: 'Package is in transit with carrier.', date: 'Pending', completed: false, active: false },
      { title: 'Out for Delivery', description: 'Package is out for delivery.', date: 'Pending', completed: false, active: false },
      { title: 'Delivered', description: 'Successfully signed and delivered.', date: 'Pending', completed: false, active: false }
    ]
  }
};

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setTrackingData(null);
    setSearched(false);

    // Simulate API delay
    setTimeout(() => {
      const cleanedId = orderId.trim().toUpperCase();
      const existingData = MOCK_TRACKING_DATA[cleanedId];

      if (existingData) {
        setTrackingData(existingData);
      } else {
        // Fallback: Generate dynamic tracking details so the user can test any ID
        setTrackingData({
          orderId: cleanedId,
          email: email.trim() || 'guest@example.com',
          status: 'transit',
          courier: 'Standard Courier Service',
          trackingNumber: `STD-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          estimatedDelivery: 'In 3 business days',
          steps: [
            { title: 'Order Placed', description: 'Your order has been received.', date: '2 days ago', completed: true, active: false },
            { title: 'Processing', description: 'Items verified and prepared for shipment.', date: '1 day ago', completed: true, active: false },
            { title: 'In Transit', description: 'Package is currently moving through logistics hubs.', date: 'Today - 09:00 AM', completed: true, active: true },
            { title: 'Out for Delivery', description: 'Package is on its way to your destination.', date: 'Pending', completed: false, active: false },
            { title: 'Delivered', description: 'Package delivered to the shipping address.', date: 'Pending', completed: false, active: false }
          ]
        });
      }
      setLoading(false);
      setSearched(true);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-neutral-950 text-white py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 backdrop-blur-md"
          >
            <Package className="w-3.5 h-3.5" />
            REAL-TIME TRACKING
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold tracking-tight text-white"
          >
            Track Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-300 text-sm max-w-md mx-auto"
          >
            Enter your order identifier and email address to get live shipping progress updates.
          </motion.p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-10">
        {/* Tracker Search Form */}
        <section className="bg-white dark:bg-neutral-800/40 p-6 md:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl backdrop-blur-md">
          <form onSubmit={handleTrackOrder} className="grid md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORV-12345"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Billing Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@example.com"
                className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 hover:scale-102 disabled:bg-neutral-400"
              >
                {loading ? 'Searching...' : 'Track'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
          <p className="text-[11px] text-neutral-400 mt-3 text-center md:text-left">
            * Try entering <span className="font-semibold text-indigo-600 dark:text-indigo-400">ORV-12345</span>, <span className="font-semibold text-indigo-600 dark:text-indigo-400">ORV-54321</span>, or any order ID.
          </p>
        </section>

        {/* Results Timeline */}
        <AnimatePresence mode="wait">
          {searched && trackingData && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Info Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/20 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Courier</p>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{trackingData.courier}</p>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/20 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Tracking Code</p>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 font-mono">{trackingData.trackingNumber}</p>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800/20 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Est. Delivery</p>
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Shipment Stepper Card */}
              <div className="bg-white dark:bg-neutral-800/40 p-6 md:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg backdrop-blur-md space-y-8">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-700/50 pb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Delivery Route & Details
                </h3>

                <div className="relative pl-8 space-y-8">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-neutral-200 dark:bg-neutral-700" />

                  {trackingData.steps.map((step, idx) => {
                    return (
                      <div key={idx} className="relative group">
                        {/* Stepper icon indicator */}
                        <div className="absolute -left-[28px] top-0 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center z-10">
                          {step.completed ? (
                            <CheckCircle2 className={`w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-neutral-800 transition-all ${step.active ? 'animate-pulse scale-110' : ''}`} />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-600 fill-white dark:fill-neutral-800" />
                          )}
                        </div>

                        {/* Text info */}
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className={`font-semibold text-sm md:text-base ${step.active ? 'text-indigo-600 dark:text-indigo-400 font-bold' : step.completed ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}`}>
                              {step.title}
                            </h4>
                            <span className="text-[10px] md:text-xs font-medium text-neutral-400 dark:text-neutral-500">
                              {step.date}
                            </span>
                          </div>
                          <p className={`text-xs md:text-sm ${step.completed ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-400/60'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
