'use client';

import { Loader2, Copy, Check } from 'lucide-react';
import type { TextBoxProps } from '../../types';

export default function TextBox({
  value,
  onChange,
  variant,
  isLoading,
  isDisabled,
  showCopyButton,
  isCopied,
  onCopy,
  rows = 4,
  maxHeight,
  placeholder,
}: TextBoxProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={variant === 'input' ? (e) => onChange?.(e.target.value) : undefined}
        readOnly={variant === 'display'}
        disabled={isDisabled}
        rows={rows}
        placeholder={placeholder}
        style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
        className={`w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 p-3 resize-none outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50 ${
          variant === 'display' ? 'cursor-default' : ''
        } ${showCopyButton ? 'pr-10' : ''}`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70 dark:bg-zinc-900/70">
          <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
        </div>
      )}
      {showCopyButton && !isLoading && value && (
        <button
          onClick={onCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          title={isCopied ? 'Copied!' : 'Copy to clipboard'}
        >
          {isCopied
            ? <Check className="w-3.5 h-3.5 text-green-500" />
            : <Copy className="w-3.5 h-3.5 text-zinc-400" />
          }
        </button>
      )}
    </div>
  );
}
