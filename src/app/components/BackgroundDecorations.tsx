"use client";

import { motion } from 'motion/react';

export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Light mode background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 transition-colors duration-300" />

      {/* Animated blur blobs - Light mode */}
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl dark:bg-indigo-500/10"
      />

      <motion.div
        animate={{
          y: [0, -50, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl dark:bg-purple-500/10"
      />

      {/* Accent blobs */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-300/15 rounded-full blur-3xl dark:bg-cyan-500/5"
      />

      {/* Grid pattern overlay - Light mode only */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.02]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-white/30 dark:to-neutral-950/50" />
    </div>
  );
}
