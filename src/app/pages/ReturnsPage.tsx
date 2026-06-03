import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw, CheckCircle2, AlertCircle, QrCode, ArrowRight, ArrowLeft, Info
} from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface ReturnItem { id: string; name: string; variantDetails: string; price: number; image: string; }

const MOCK_ORDER_ITEMS: Record<string, ReturnItem[]> = {
  'ORV-12345': [
    { id: 'item-1', name: 'Cloud Runner Pro', variantDetails: 'Midnight Blue / Size 9', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
  ],
  'ORV-54321': [
    { id: 'item-2', name: 'AeroSound Elite', variantDetails: 'Matte Black / One Size', price: 249.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
    { id: 'item-3', name: 'Urban Knit Hoodie', variantDetails: 'Desert Sand / Size M', price: 79.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80' },
  ],
};

const STEPS = [
  { stepNum: 1, label: 'Find Order' },
  { stepNum: 2, label: 'Select Items' },
  { stepNum: 3, label: 'Refund' },
  { stepNum: 4, label: 'Label' },
];

export function ReturnsPage() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderItems, setOrderItems] = useState<ReturnItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReasons, setReturnReasons] = useState<Record<string, string>>({});
  const [refundMethod, setRefundMethod] = useState<'original' | 'credit'>('original');
  const [returnMethod, setReturnMethod] = useState<'dropoff' | 'pickup'>('dropoff');

  const barcodeNumber = `ORV-RET-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const handleFindOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const cleanedId = orderId.trim().toUpperCase();
      const items = MOCK_ORDER_ITEMS[cleanedId] || [
        { id: 'gen-1', name: 'Cloud Runner Pro', variantDetails: 'Midnight Blue / Size 9', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' },
      ];
      setOrderItems(items);
      setSelectedItems([]);
      setStep(2);
      setLoading(false);
    }, 800);
  };

  const handleNextToStep3 = () => {
    if (selectedItems.length === 0) { setError('Please select at least one item to return.'); return; }
    if (selectedItems.some((id) => !returnReasons[id])) { setError('Please select a return reason for each item.'); return; }
    setError('');
    setStep(3);
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
            <RotateCcw className="w-3.5 h-3.5" />
            EASY RETURNS
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight"
          >
            Returns & Exchanges
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-neutral-300 text-xs sm:text-sm max-w-md mx-auto px-2"
          >
            Initiate a return, select items, and get a prepaid shipping label in minutes.
          </motion.p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Progress Steps */}
        <div className="flex items-start justify-between mb-8 sm:mb-10 relative">
          {/* connector line */}
          <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-0.5 bg-neutral-200 dark:bg-neutral-700 z-0" />
          {STEPS.map((s) => (
            <div key={s.stepNum} className="flex flex-col items-center gap-1.5 z-10 flex-1">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                step >= s.stepNum
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-400'
              }`}>
                {step > s.stepNum ? '✓' : s.stepNum}
              </div>
              <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide uppercase text-center leading-tight max-w-[48px] ${
                step >= s.stepNum ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="bg-white dark:bg-neutral-800/40 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl backdrop-blur-md">
          <AnimatePresence mode="wait">

            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">Find Your Order</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enter your order details to retrieve eligible items.</p>
                </div>
                <form onSubmit={handleFindOrder} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order ID</label>
                      <input required value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. ORV-12345"
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. customer@example.com"
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm disabled:bg-neutral-400">
                    {loading ? 'Searching...' : 'Continue'} {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 sm:p-4 rounded-xl flex gap-3 text-xs text-neutral-500 border border-neutral-200/50 dark:border-neutral-700/50">
                  <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p>Returns accepted within <strong>30 days</strong> of purchase. Items must be unused with tags attached.</p>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">Select Items to Return</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">Check items and select a return reason for each.</p>
                </div>
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-3">
                  {orderItems.map((item) => {
                    const isChecked = selectedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`p-3 sm:p-4 rounded-xl border transition-all ${isChecked ? 'bg-indigo-50/30 border-indigo-400 dark:bg-indigo-950/10' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700'}`}>
                        <div className="flex items-start gap-3">
                          <input type="checkbox" checked={isChecked}
                            onChange={() => setSelectedItems((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])}
                            className="w-4 h-4 mt-0.5 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-500 cursor-pointer flex-shrink-0" />
                          <img src={item.image} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border dark:border-neutral-700 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">{item.name}</h4>
                            <p className="text-[10px] sm:text-xs text-neutral-400">{item.variantDetails}</p>
                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">${item.price}</p>
                          </div>
                        </div>
                        {isChecked && (
                          <div className="mt-3 pl-7">
                            <select value={returnReasons[item.id] || ''} onChange={(e) => setReturnReasons((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                              <option value="">Select Return Reason</option>
                              <option value="size">Size does not fit</option>
                              <option value="defect">Item damaged / defective</option>
                              <option value="wrong">Received wrong item</option>
                              <option value="expectation">Did not meet expectations</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleNextToStep3} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg text-sm">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white">Select Refund & Shipping</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">Choose how you'd like to be refunded and how you'll return the package.</p>
                </div>

                {/* Refund Method */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Refund Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'original', title: 'Original Payment', desc: 'Refund to your card (5-7 business days)' },
                      { key: 'credit', title: 'Store Credit +10%', desc: 'Instant credit with 10% bonus for future orders' },
                    ].map((opt) => (
                      <button key={opt.key} onClick={() => setRefundMethod(opt.key as 'original' | 'credit')}
                        className={`p-3 sm:p-4 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${refundMethod === opt.key ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'}`}>
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">{opt.title}</span>
                        <span className="text-[10px] sm:text-xs text-neutral-400">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Return Shipping */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Return Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'dropoff', title: 'Prepaid Drop-off', desc: 'Free label. Drop at any FedEx location.' },
                      { key: 'pickup', title: 'Courier Pickup', desc: 'Agent picks up from your door (+$5 fee).' },
                    ].map((opt) => (
                      <button key={opt.key} onClick={() => setReturnMethod(opt.key as 'dropoff' | 'pickup')}
                        className={`p-3 sm:p-4 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${returnMethod === opt.key ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'}`}>
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">{opt.title}</span>
                        <span className="text-[10px] sm:text-xs text-neutral-400">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg text-sm">
                    Submit <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-xl text-neutral-900 dark:text-white">Return Authorized!</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                    Your prepaid label has been generated. A copy was sent to your email.
                  </p>
                </div>

                {/* Barcode */}
                <div className="bg-neutral-50 dark:bg-neutral-900/60 p-5 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 max-w-[240px] mx-auto space-y-3">
                  <QrCode className="w-28 h-28 sm:w-36 sm:h-36 mx-auto text-neutral-800 dark:text-white" />
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Tracking Code</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 break-all">{barcodeNumber}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-left bg-neutral-50 dark:bg-neutral-800/30 p-4 sm:p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 space-y-3">
                  <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-indigo-500" />
                    Return Instructions
                  </h4>
                  <ul className="space-y-2 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400">
                    {['Package items securely in original packaging with all tags attached.', 'Print this label and tape it to the outside of the box.', 'Drop the package at any FedEx location within 10 days.'].map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="w-4 h-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold text-[9px] flex-shrink-0">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={() => { setStep(1); setOrderId(''); setEmail(''); setSelectedItems([]); setReturnReasons({}); }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-neutral-900 dark:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-all">
                  Start Another Return
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
