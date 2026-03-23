'use client';

import { Upload } from 'lucide-react';
import type { UploadZoneProps } from '../../types';

export default function UploadZone({
  isProcessing,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  fileInputRef,
  onFileChange,
}: UploadZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-colors ${
        isDragging
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 cursor-copy'
          : isProcessing
          ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed'
          : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer'
      }`}
    >
      <Upload className={`w-5 h-5 ${isDragging ? 'text-blue-500' : 'text-zinc-400'}`} />
      <p className={`text-sm text-center ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {isProcessing ? 'Processing…' : isDragging ? 'Drop audio file here' : 'Drop audio or click to upload'}
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
