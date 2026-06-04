import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle } from 'lucide-react';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  status: 'success' | 'error';
  onClose: () => void;
}

export function OrderConfirmationModal({ isOpen, status, onClose }: OrderConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-black"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {status === 'success' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1, damping: 15, stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold font-display">Order Placed Successfully!</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your order has been placed and is being processed. You will receive a confirmation email shortly.
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1, damping: 15, stiffness: 200 }}
                  >
                    <XCircle className="w-16 h-16 text-red-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold font-display">Order Couldn't Be Placed</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Something went wrong while processing your order. Please try again.
                  </p>
                </>
              )}
              <motion.button
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors border-2 border-black"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {status === 'success' ? 'Continue Shopping' : 'Try Again'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
