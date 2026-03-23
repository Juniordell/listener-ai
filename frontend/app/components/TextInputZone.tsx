'use client';

import { useState } from 'react';
import { Type } from 'lucide-react';
import Box from './Box';
import TextBox from './TextBox';
import type { TextInputZoneProps } from '../../types';

export default function TextInputZone({ isProcessing, onTextSubmit }: TextInputZoneProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    onTextSubmit(inputText);
    setInputText('');
  };

  return (
    <Box header="Paste Text" icon={Type}>
      <div className="flex flex-col gap-3">
        <TextBox
          variant="input"
          value={inputText}
          onChange={setInputText}
          isDisabled={isProcessing}
          rows={3}
          placeholder="Paste text to clean with LLM…"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || isProcessing}
          className="self-end px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clean text
        </button>
      </div>
    </Box>
  );
}
