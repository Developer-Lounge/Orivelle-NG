import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Package, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useOrderStore } from '../../../store/orderStore';
import { BackgroundDecorations } from '../../components/BackgroundDecorations';

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-sky-100 text-sky-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-violet-100 text-violet-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function OrdersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const orders = useOrderStore((state) => state.orders);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin?redirect=/account/orders', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen pb-20 transition-colors duration-300 relative overflow-hidden">
      <BackgroundDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-5 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-sm font-semibold dark:bg-indigo-950/40 dark:text-indigo-300">
                <Package className="w-4 h-4" /> My Orders
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white">
                Track your purchase history
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                View every completed order, shipping status, and quick links to track each shipment.
              </p>
            </div>
            <Link
              to="/track-order"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-3 text-sm font-semibold hover:bg-neutral-900 transition"
            >
              Track Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-10 text-center shadow-xl">
            <Package className="mx-auto mb-6 h-12 w-12 text-indigo-600" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">No orders yet</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Once you complete a checkout, your order will appear here. Start shopping and place your first order.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-6 shadow-xl">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">Order ID:</span>
                      <span className="font-mono text-neutral-700 dark:text-neutral-300">{order.id}</span>
                      <span className="mx-1 text-neutral-300">·</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] shadow-sm ${statusStyles[order.status]}`}>
                      <span>{order.status}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Shipping to {order.city}, {order.state}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-neutral-700 dark:text-neutral-200">
                      <MapPin className="w-4 h-4" /> {order.paymentMethod.toUpperCase()}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900 px-3 py-2 text-neutral-700 dark:text-neutral-200">
                      <Calendar className="w-4 h-4" /> ₦{order.total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.variantId} className="flex items-center gap-3 sm:gap-4 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-950/30">
                        <img src={item.image} alt={item.productName} className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{item.productName}</h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.brand} • {item.color} • {item.size}</p>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.quantity} x ₦{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 p-5 bg-neutral-50 dark:bg-neutral-950/30 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Order summary</h4>
                        <div className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
                          <div className="flex justify-between"><span>Subtotal</span><span>₦{order.subtotal.toFixed(2)}</span></div>
                          <div className="flex justify-between"><span>Delivery</span><span>₦{order.deliveryFee.toFixed(2)}</span></div>
                          <div className="flex justify-between font-semibold"><span>Total</span><span>₦{order.total.toFixed(2)}</span></div>
                        </div>
                      </div>
                      <div className="rounded-3xl bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">Order Notes</p>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Use the order ID above on the Track Order page anytime.</p>
                      </div>
                    </div>
                    <Link
                      to="/track-order"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                      Track this order
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
