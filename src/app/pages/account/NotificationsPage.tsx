import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bell, Sparkles, Zap, Info } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import promos from '../../../data/promos.json';
import { BackgroundDecorations } from '../../components/BackgroundDecorations';

export function NotificationsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUnreadNotifications = useAuthStore((state) => state.setUnreadNotifications);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin?redirect=/account/notifications', { replace: true });
      return;
    }
    setUnreadNotifications(0);
  }, [isAuthenticated, navigate, setUnreadNotifications]);

  if (!isAuthenticated) {
    return null;
  }

  const alerts = [
    {
      icon: Info,
      title: 'Order updates are live',
      description: 'Check My Orders after every purchase for the latest shipping and payment status.',
      status: 'Important',
    },
    {
      icon: Zap,
      title: 'Flash Sale alerts',
      description: 'Never miss another flash sale — all current offers are collected here for fast access.',
      status: 'Flash Sale',
    },
    {
      icon: Sparkles,
      title: 'New promos added',
      description: 'We keep this feed fresh with promo messages, delivery upgrades, and limited-time events.',
      status: 'Promo',
    },
  ];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen pb-20 transition-colors duration-300 relative overflow-hidden">
      <BackgroundDecorations />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 text-sky-800 px-3 py-1 text-sm font-semibold dark:bg-sky-900/20 dark:text-sky-200">
                <Bell className="w-4 h-4" /> Notifications
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-display font-bold text-neutral-900 dark:text-white">
                All the news you need
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                Promo alerts, flash sale reminders, and important order updates for your account.
              </p>
            </div>
            <Link
              to="/flash-sales"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              View Flash Sales
                <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.title} className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 p-3 text-indigo-600 dark:text-indigo-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">{alert.status}</p>
                      <h2 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-white">{alert.title}</h2>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{alert.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Stay ahead of every deal</p>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Click through to active promotions or revisit the sales page for the latest discounts.</p>
                </div>
                <Link
                  to="/products"
                  className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 text-amber-800 p-3">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Flash Sales</p>
                  <h2 className="mt-2 text-lg font-semibold text-neutral-900 dark:text-white">Live Promo Messages</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {promos.map((promo) => (
                  <div key={promo.id} className={`rounded-3xl p-4 ${promo.backgroundClass} ${promo.textClass}`}>
                    <p className="text-sm font-semibold">{promo.message}</p>
                    {promo.endDate && <p className="mt-2 text-[11px] text-neutral-800 dark:text-neutral-100">Expires {new Date(promo.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Action Required</p>
              <h2 className="mt-3 text-lg font-semibold text-neutral-900 dark:text-white">Check your inbox</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">We also send delivery, payment, and warranty notifications to the email on your account.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
