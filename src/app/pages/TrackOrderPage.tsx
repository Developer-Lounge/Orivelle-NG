import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Calendar, ArrowRight, Truck, CheckCircle2, Circle, MapPin } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface TrackingStatusStep { title: string; description: string; date: string; completed: boolean; active: boolean; }
interface TrackingDetails { orderId: string; email: string; status: string; courier: string; trackingNumber: string; estimatedDelivery: string; steps: TrackingStatusStep[]; }

const MOCK_TRACKING_DATA: Record<string, TrackingDetails> = {
  'ORV-12345': {
    orderId: 'ORV-12345', email: 'customer@example.com', status: 'transit',
    courier: 'FedEx Express', trackingNumber: 'FX-83921-9321', estimatedDelivery: 'June 5, 2026',
    steps: [
      { title: 'Order Placed', description: 'Your order has been received and is being processed.', date: 'June 1, 2026 - 10:24 AM', completed: true, active: false },
      { title: 'Processing', description: 'Payment confirmed. Items packed and handed over to courier.', date: 'June 2, 2026 - 02:15 PM', completed: true, active: false },
      { title: 'In Transit', description: 'Package departed shipping hub in Memphis, TN.', date: 'June 3, 2026 - 08:30 AM', completed: true, active: true },
      { title: 'Out for Delivery', description: 'Package is loaded on delivery vehicle.', date: 'Pending', completed: false, active: false },
      { title: 'Delivered', description: 'Successfully signed and delivered.', date: 'Pending', completed: false, active: false },
    ],
  },
  'ORV-54321': {
    orderId: 'ORV-54321', email: 'test@example.com', status: 'delivered',
    courier: 'DHL Express', trackingNumber: 'DHL-98124-5231', estimatedDelivery: 'June 2, 2026 (Delivered)',
    steps: [
      { title: 'Order Placed', description: 'Your order has been received.', date: 'May 28, 2026 - 09:12 AM', completed: true, active: false },
      { title: 'Processing', description: 'Payment confirmed. Items packed and handed to courier.', date: 'May 29, 2026 - 11:30 AM', completed: true, active: false },
      { title: 'In Transit', description: 'Package departed shipping hub in Frankfurt, DE.', date: 'May 30, 2026 - 04:45 PM', completed: true, active: false },
      { title: 'Out for Delivery', description: 'Package is loaded on delivery vehicle.', date: 'June 2, 2026 - 08:00 AM', completed: true, active: false },
      { title: 'Delivered', description: 'Successfully signed and delivered by agent.', date: 'June 2, 2026 - 03:22 PM', completed: true, active: true },
    ],
  },
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
    setTimeout(() => {
      const cleanedId = orderId.trim().toUpperCase();
      const data = MOCK_TRACKING_DATA[cleanedId] || {
        orderId: cleanedId, email: email.trim() || 'guest@example.com', status: 'transit',
        courier: 'Standard Courier', trackingNumber: `STD-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        estimatedDelivery: 'In 3 business days',
        steps: [
          { title: 'Order Placed', description: 'Your order has been received.', date: '2 days ago', completed: true, active: false },
          { title: 'Processing', description: 'Items verified and prepared for shipment.', date: '1 day ago', completed: true, active: false },
          { title: 'In Transit', description: 'Package is moving through logistics hubs.', date: 'Today - 09:00 AM', completed: true, active: true },
          { title: 'Out for Delivery', description: 'Package is on its way to your address.', date: 'Pending', completed: false, active: false },
          { title: 'Delivered', description: 'Package delivered to the shipping address.', date: 'Pending', completed: false, active: false },
        ],
      };
      setTrackingData(data);
      setLoading(false);
      setSearched(true);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-neutral-950 text-white py-12 md:py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400"
          >
            <Package className="w-3.5 h-3.5" />
            REAL-TIME TRACKING
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-white"
          >
            Track Your Order
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-neutral-300 text-xs sm:text-sm max-w-md mx-auto px-2"
          >
            Enter your order ID and email to get live shipping progress updates.
          </motion.p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 space-y-8">
        {/* Search Form */}
        <section className="bg-white dark:bg-neutral-800/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl backdrop-blur-md">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Order Number</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORV-12345"
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Billing Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:bg-neutral-400 text-sm"
            >
              {loading ? 'Searching...' : 'Track My Order'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-3 text-center">
            * Try <span className="font-semibold text-indigo-600 dark:text-indigo-400">ORV-12345</span> or{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">ORV-54321</span> to see a demo
          </p>
        </section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && trackingData && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              {/* Info Cards — stack on mobile, 3-col on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { icon: Package, label: 'Courier', value: trackingData.courier },
                  { icon: Truck, label: 'Tracking Code', value: trackingData.trackingNumber },
                  { icon: Calendar, label: 'Est. Delivery', value: trackingData.estimatedDelivery },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-neutral-50 dark:bg-neutral-800/20 p-4 sm:p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-neutral-400">{label}</p>
                      <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipment Stepper */}
              <div className="bg-white dark:bg-neutral-800/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg backdrop-blur-md">
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-700/50 pb-3 mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                  Delivery Route & Details
                </h3>

                <div className="relative pl-7 sm:pl-8 space-y-6 sm:space-y-8">
                  <div className="absolute left-[13px] sm:left-[15px] top-2 bottom-2 w-0.5 bg-neutral-200 dark:bg-neutral-700" />
                  {trackingData.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[26px] sm:-left-[28px] top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center z-10">
                        {step.completed ? (
                          <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 fill-emerald-50 dark:fill-neutral-800 ${step.active ? 'animate-pulse scale-110' : ''}`} />
                        ) : (
                          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300 dark:text-neutral-600 fill-white dark:fill-neutral-800" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-0.5">
                          <h4 className={`font-semibold text-sm ${step.active ? 'text-indigo-600 dark:text-indigo-400' : step.completed ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">{step.date}</span>
                        </div>
                        <p className={`text-xs sm:text-sm ${step.completed ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-400/60'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
