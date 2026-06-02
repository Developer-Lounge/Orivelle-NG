"use client";

import { ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef, useReducedMotion } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  staggerChildren = false,
  staggerDelay = 0.07,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });
  const prefersReducedMotion = useReducedMotion();

  const directionVariants = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
  };

  const containerVariants = staggerChildren
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
          },
        },
      }
    : {};

  const itemVariants = staggerChildren
    ? {
        hidden: directionVariants[direction],
        visible: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: { duration: prefersReducedMotion ? 0 : duration },
        },
      }
    : {};

  if (prefersReducedMotion) {
    return <div ref={ref}>{children}</div>;
  }

  if (staggerChildren) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {/* If children is an array, wrap each in motion.div with itemVariants */}
        {Array.isArray(children)
          ? children.map((child, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                {child}
              </motion.div>
            ))
          : children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : directionVariants[direction]}
      transition={{ duration: duration, delay: delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
