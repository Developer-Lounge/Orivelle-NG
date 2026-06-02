import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { QuantityInput } from './QuantityInput';

export function CartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeCart}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col backdrop-blur-xl border-l border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Shopping Cart ({items.length})</h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeCart}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                      <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4 mx-auto" />
                    </motion.div>
                    <p className="text-neutral-500 dark:text-neutral-400">Your cart is empty</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeCart}
                      className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold"
                    >
                      Continue shopping
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 pb-6 border-b"
                      >
                        <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-300 dark:border-neutral-600">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.brand}</p>
                              <h3 className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">{item.productName}</h3>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.variantId)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                            {item.color} / Size {item.size}
                          </p>
                          <div className="flex items-center justify-between">
                            <QuantityInput
                              value={item.quantity}
                              onChange={(qty) => updateQuantity(item.variantId, qty)}
                              max={10}
                            />
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-neutral-200 dark:border-neutral-800 p-6 space-y-4 bg-neutral-50 dark:bg-neutral-800/30">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
                      <span className="text-neutral-900 dark:text-neutral-100">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Shipping</span>
                      <span className="text-neutral-900 dark:text-neutral-100">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Total</span>
                      <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      closeCart();
                      navigate('/checkout');
                    }}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold shadow-lg hover:shadow-indigo-500/50"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
