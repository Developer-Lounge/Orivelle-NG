import { Outlet, Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { PromoBar } from '../components/PromoBar';
import { SearchBar } from '../components/SearchBar';
import { NavbarUserSection } from '../components/NavbarUserSection';
import { CartDrawer } from '../components/CartDrawer';
import { useCartStore } from '../../store/cartStore';

export function RootLayout() {
  const { openCart, items } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <PromoBar />
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl flex-shrink-0">
            Orivelle
          </Link>
          <SearchBar />
          <NavbarUserSection />
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <Outlet />
      <CartDrawer />
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg mb-4">Orivelle</h3>
              <p className="text-sm text-gray-400">
                Your trusted destination for premium products at unbeatable prices.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">All Products</Link></li>
                <li><Link to="/" className="hover:text-white">Flash Sales</Link></li>
                <li><Link to="/" className="hover:text-white">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white">Track Order</Link></li>
                <li><Link to="/" className="hover:text-white">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/auth/signin" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/auth/signup" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Orivelle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
