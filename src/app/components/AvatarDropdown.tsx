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
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white ring-1 ring-gray-200 transition hover:ring-gray-300"
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
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="px-4 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="flex flex-col p-2">
              <Link
                to="/account/orders"
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                to="/account/notifications"
                className="flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-gray-50"
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
            <div className="border-t border-gray-100" />
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-gray-50"
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
