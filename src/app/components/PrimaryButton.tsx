"use client";

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from './ui/button';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
  asChild,
}: PrimaryButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all ${className}`}
        asChild={asChild}
      >
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
            animate={{
              x: ['−1000px', '1000px'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            style={{ pointerEvents: 'none' }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
