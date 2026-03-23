'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import Box from './Box';
import TextBox from './TextBox';
import type { SettingsPanelProps } from '../../types';

export default function SettingsPanel({
  useLLM,
  onUseLLMChange,
  systemPrompt,
  onSystemPromptChange,
  isLoadingPrompt,
}: SettingsPanelProps) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  return (
    <Box header="Settings" icon={Settings}>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
          <div
            onClick={() => onUseLLMChange(!useLLM)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              useLLM ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 shadow transition-transform ${
                useLLM ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Clean with LLM</span>
        </label>

        {useLLM && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <button
              onClick={() => setIsPromptExpanded((p) => !p)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <span>System Prompt</span>
              <span className="text-xs text-zinc-400">{isPromptExpanded ? '▲' : '▼'}</span>
            </button>
            {isPromptExpanded && (
              <div className="px-3 pb-3">
                <TextBox
                  variant="input"
                  value={systemPrompt}
                  onChange={onSystemPromptChange}
                  isLoading={isLoadingPrompt}
                  rows={4}
                  placeholder="Enter system prompt…"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Box>
  );
}
