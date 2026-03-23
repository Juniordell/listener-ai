'use client';

import { Mic, Square, Loader2 } from 'lucide-react';
import type { RecordButtonProps } from '../../types';

export default function RecordButton({
  isRecording,
  isProcessing,
  onStart,
  onStop,
}: RecordButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={isProcessing}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 focus-visible:ring-red-500'
            : isProcessing
            ? 'bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed'
            : 'bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-200 focus-visible:ring-zinc-500'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-7 h-7 text-zinc-500 animate-spin" />
        ) : isRecording ? (
          <Square className="w-7 h-7 text-white fill-white" />
        ) : (
          <Mic className="w-7 h-7 text-white dark:text-zinc-900" />
        )}
      </button>
      <span className="text-xs text-zinc-400 dark:text-zinc-500">Hold V key to record</span>
    </div>
  );
}
