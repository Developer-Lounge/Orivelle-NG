"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { Bell, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function AvatarDropdown() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const unreadNotifications = useAuthStore((state) => state.unreadNotifications);
  const signOut = useAuthStore((state) => state.signOut);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    navigate('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 text-sm font-semibold text-white ring-1 ring-indigo-200 dark:ring-indigo-400/50 transition hover:ring-indigo-300 dark:hover:ring-indigo-300"
        aria-label="Open user menu"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-2xl dark:shadow-2xl backdrop-blur-sm"
          >
            <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
            </div>
            <div className="flex flex-col p-2">
              <Link
                to="/account/orders"
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
                onClick={() => setOpen(false)}
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                to="/account/notifications"
                className="flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </span>
                {unreadNotifications > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700" />
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
