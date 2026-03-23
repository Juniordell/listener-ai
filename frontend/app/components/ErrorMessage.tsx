'use client';

import { X } from 'lucide-react';
import type { ErrorMessageProps } from '../../types';

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
      <p className="flex-1 text-sm text-red-700 dark:text-red-400">{message}</p>
      <button
        onClick={onDismiss}
        className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-red-500 dark:text-red-400"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
