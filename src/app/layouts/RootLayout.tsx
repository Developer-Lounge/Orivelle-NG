import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { PromoBar } from '../components/PromoBar';
import { SearchBar } from '../components/SearchBar';
import { NavbarUserSection } from '../components/NavbarUserSection';
import { ThemeToggle } from '../components/ThemeToggle';
import { CartDrawer } from '../components/CartDrawer';
import { useCartStore } from '../../store/cartStore';
import { initTheme } from '../../store/themeStore';

export function RootLayout() {
  const { openCart, items } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 transition-colors duration-300">
      <PromoBar />
      <motion.header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-lg'
            : 'backdrop-blur-md bg-white/60 dark:bg-neutral-900/40 border-b border-neutral-200/30 dark:border-neutral-700/30'
        }`}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl flex-shrink-0 font-display font-bold tracking-tight">
            <span className="text-neutral-900 dark:text-white">Orivelle</span>
          </Link>
          <SearchBar />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavbarUserSection />
          </div>
          <motion.button
            onClick={openCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-lg bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-sm border border-white/20 dark:border-white/10 flex-shrink-0"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.header>
      <Outlet />
      <CartDrawer />
      {/* footer */}
      <footer className="relative z-10 bg-neutral-900 dark:bg-neutral-950 text-white mt-20 border-t border-neutral-700/50 dark:border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-display font-bold mb-4 text-white">Orivelle</h3>
              <p className="text-sm text-neutral-400">
                Your trusted destination for premium products at unbeatable prices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-white">Shop</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><Link to="/products" className="hover:text-indigo-300 transition-colors">All Products</Link></li>
                <li><Link to="/flash-sales" className="hover:text-indigo-300 transition-colors">Flash Sales</Link></li>
                <li><Link to="/new-arrivals" className="hover:text-indigo-300 transition-colors">New Arrivals</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><Link to="/help-center" className="hover:text-indigo-300 transition-colors">Help Center</Link></li>
                <li><Link to="/track-order" className="hover:text-indigo-300 transition-colors">Track Order</Link></li>
                <li><Link to="/returns" className="hover:text-indigo-300 transition-colors">Returns</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold mb-4 text-white">Account</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><Link to="/auth/signin" className="hover:text-indigo-300 transition-colors">Sign In</Link></li>
                <li><Link to="/auth/signup" className="hover:text-indigo-300 transition-colors">Sign Up</Link></li>
              </ul>
            </motion.div>
          </div>
          <div className="border-t border-neutral-700/50 dark:border-neutral-800/50 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2026 Orivelle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
