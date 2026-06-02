"use client";

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/authStore';
import { AvatarDropdown } from './AvatarDropdown';

export function NavbarUserSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <AvatarDropdown />
      ) : (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            asChild
          >
            <Link
              to="/auth/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Sign up
            </Link>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            asChild
          >
            <Link
              to="/auth/signin"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            >
              Log in
            </Link>
          </motion.button>
        </div>
      )}
    </div>
  );
}
