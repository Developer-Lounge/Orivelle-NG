import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Info
} from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface ReturnItem {
  id: string;
  name: string;
  variantDetails: string;
  price: number;
  image: string;
}

const MOCK_ORDER_ITEMS: Record<string, ReturnItem[]> = {
  'ORV-12345': [
    { id: 'item-1', name: 'Cloud Runner Pro', variantDetails: 'Midnight Blue / Size 9', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' }
  ],
  'ORV-54321': [
    { id: 'item-2', name: 'AeroSound Elite', variantDetails: 'Matte Black / One Size', price: 249.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80' },
    { id: 'item-3', name: 'Urban Knit Hoodie', variantDetails: 'Desert Sand / Size M', price: 79.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80' }
  ]
};

export function ReturnsPage() {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retreived order details
  const [orderItems, setOrderItems] = useState<ReturnItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReasons, setReturnReasons] = useState<Record<string, string>>({});
  const [refundMethod, setRefundMethod] = useState<'original' | 'credit'>('original');
  const [returnMethod, setReturnMethod] = useState<'dropoff' | 'pickup'>('dropoff');

  const handleFindOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      const cleanedId = orderId.trim().toUpperCase();
      const items = MOCK_ORDER_ITEMS[cleanedId];

      if (items) {
        setOrderItems(items);
        setSelectedItems([]);
        setStep(2);
      } else {
        // Fallback generic order items so any order works
        setOrderItems([
          { id: 'gen-1', name: 'Cloud Runner Pro', variantDetails: 'Midnight Blue / Size 9', price: 159.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80' }
        ]);
        setSelectedItems([]);
        setStep(2);
      }
      setLoading(false);
    }, 800);
  };

  const handleToggleItemSelect = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleReasonChange = (itemId: string, reason: string) => {
    setReturnReasons((prev) => ({ ...prev, [itemId]: reason }));
  };

  const handleNextToStep3 = () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item to return.');
      return;
    }
    // Verify all selected items have a reason
    const missingReason = selectedItems.some((id) => !returnReasons[id]);
    if (missingReason) {
      setError('Please select a return reason for all selected items.');
      return;
    }

    setError('');
    setStep(3);
  };

  const handleNextToStep4 = () => {
    setStep(4);
  };

  const barcodeNumber = `ORV-RET-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

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
            <RotateCcw className="w-3.5 h-3.5" />
            EASY RETURNS
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold tracking-tight text-white"
          >
            Returns & Exchanges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-300 text-sm max-w-md mx-auto"
          >
            Initiate a return request, select items, and generate a prepaid shipping label in minutes.
          </motion.p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Progress indicator */}
        <div className="flex justify-between items-center max-w-md mx-auto mb-10">
          {[
            { stepNum: 1, label: 'Find Order' },
            { stepNum: 2, label: 'Select Items' },
            { stepNum: 3, label: 'Refund Method' },
            { stepNum: 4, label: 'Get Label' }
          ].map((s) => (
            <div key={s.stepNum} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all z-10 ${
                  step >= s.stepNum
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                }`}
              >
                {step > s.stepNum ? '✓' : s.stepNum}
              </div>
              <span className={`text-[10px] mt-2 font-bold tracking-wider uppercase ${step >= s.stepNum ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Forms Card */}
        <div className="bg-white dark:bg-neutral-800/40 p-6 md:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            {/* Step 1: Find Order */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Find Your Order</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Enter your order details to retrieve eligible items for return.
                  </p>
                </div>

                <form onSubmit={handleFindOrder} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Order ID
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Email Address
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
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Searching...' : 'Continue'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl flex gap-3 text-xs text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50">
                  <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <p>
                    <strong>Policy reminder:</strong> Returns are accepted within 30 days of the purchase date. All tags must remain attached, and items must be unused.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Items */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Select Items to Return</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Check the box next to the items you want to return, and select a reason.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {orderItems.map((item) => {
                    const isChecked = selectedItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center ${
                          isChecked
                            ? 'bg-indigo-50/30 border-indigo-500 dark:bg-indigo-950/10'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleItemSelect(item.id)}
                            className="w-4 h-4 text-indigo-600 border-neutral-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border dark:border-neutral-700"
                          />
                          <div>
                            <h4 className="font-semibold text-sm text-neutral-950 dark:text-white">{item.name}</h4>
                            <p className="text-xs text-neutral-400">{item.variantDetails}</p>
                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">${item.price}</p>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="sm:ml-auto w-full sm:w-auto">
                            <select
                              required
                              value={returnReasons[item.id] || ''}
                              onChange={(e) => handleReasonChange(item.id, e.target.value)}
                              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="">Select Return Reason</option>
                              <option value="size">Size does not fit</option>
                              <option value="defect">Item damaged/defective</option>
                              <option value="wrong">Received wrong item</option>
                              <option value="expectation">Did not meet expectations</option>
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNextToStep3}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Refund Method */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Select Refund & Shipping Option</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Choose how you want to be refunded and how you will return the package.
                  </p>
                </div>

                {/* Refund Method */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Refund Method</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setRefundMethod('original')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        refundMethod === 'original'
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <span className="font-semibold text-sm text-neutral-900 dark:text-white">Original Payment Method</span>
                      <span className="text-xs text-neutral-400">Refunding directly back to your card (takes 5-7 business days).</span>
                    </button>
                    <button
                      onClick={() => setRefundMethod('credit')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        refundMethod === 'credit'
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <span className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                        Orivelle Store Credit
                        <span className="bg-emerald-500 text-white text-[9px] font-black tracking-wide uppercase px-1.5 py-0.5 rounded">
                          +10% Bonus
                        </span>
                      </span>
                      <span className="text-xs text-neutral-400">Refund credited immediately. Enjoy a 10% bonus for future purchases.</span>
                    </button>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Return Courier Method</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setReturnMethod('dropoff')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        returnMethod === 'dropoff'
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <span className="font-semibold text-sm text-neutral-900 dark:text-white">Prepaid Drop-off Label</span>
                      <span className="text-xs text-neutral-400">Free prepaid label. Print and drop package off at any FedEx location.</span>
                    </button>
                    <button
                      onClick={() => setReturnMethod('pickup')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                        returnMethod === 'pickup'
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <span className="font-semibold text-sm text-neutral-900 dark:text-white">Courier Home Pickup</span>
                      <span className="text-xs text-neutral-400">FedEx agent picks up packaging from your front door (+$5 service fee).</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNextToStep4}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
                  >
                    Submit Request
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Get Label Barcode */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-neutral-900 dark:text-white">Return Request Authorized</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Your prepaid return shipping label and barcode have been generated. We sent a copy to your email.
                  </p>
                </div>

                {/* Simulated Barcode */}
                <div className="bg-neutral-50 dark:bg-neutral-900/60 p-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 max-w-xs mx-auto space-y-4">
                  <div className="flex items-center justify-center text-neutral-800 dark:text-white">
                    <QrCode className="w-36 h-36" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Prepaid Tracking Code</span>
                    <span className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-300">{barcodeNumber}</span>
                  </div>
                </div>

                {/* Next Steps List */}
                <div className="text-left bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 space-y-3">
                  <h4 className="font-semibold text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                    <Info className="w-4.5 h-4.5 text-indigo-500" />
                    Instructions for Return
                  </h4>
                  <ul className="space-y-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <li className="flex gap-2">
                      <span className="w-4 h-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                      <span>Package the items securely in their original packaging, ensuring all labels are intact.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-4 h-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                      <span>Print this generated label and tape it securely to the outside of the box.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="w-4 h-4 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                      <span>Drop the package off at any FedEx drop-off location or authorized retailer.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-neutral-900 dark:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all hover:bg-neutral-800"
                >
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
