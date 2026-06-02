"use client";

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled,
}: FormInputProps) {
  const isFilled = value.trim().length > 0;

  return (
    <div className="relative">
      <motion.input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder || label}
        className={`w-full px-4 py-3 border-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-all focus:outline-none ${
          error
            ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20'
            : 'border-neutral-200 dark:border-neutral-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20'
        }`}
      />
      <motion.label
        htmlFor={id}
        animate={{
          scale: isFilled ? 0.85 : 1,
          y: isFilled ? -24 : 0,
          opacity: isFilled ? 0.7 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute left-4 top-3 origin-left cursor-text font-medium transition-all pointer-events-none ${
          isFilled
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-neutral-600 dark:text-neutral-400'
        }`}
      >
        {label}
      </motion.label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
