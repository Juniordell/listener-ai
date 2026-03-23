'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import type { BoxProps } from '../../types';

export default function Box({
  children,
  header,
  icon: Icon,
  collapsible,
  isExpanded,
  onToggleExpanded,
}: BoxProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {header && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{header}</span>
          </div>
          {collapsible && onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isExpanded
                ? <ChevronUp className="w-4 h-4 text-zinc-500" />
                : <ChevronDown className="w-4 h-4 text-zinc-500" />
              }
            </button>
          )}
        </div>
      )}
      {(!collapsible || isExpanded) && (
        <div className="p-4">{children}</div>
      )}
    </div>
  );
}
