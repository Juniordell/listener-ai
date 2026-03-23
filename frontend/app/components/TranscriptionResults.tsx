'use client';

import { FileText, Sparkles } from 'lucide-react';
import Box from './Box';
import TextBox from './TextBox';
import type { TranscriptionResultsProps } from '../../types';

export default function TranscriptionResults({
  isProcessing,
  isCleaningWithLLM,
  rawText,
  cleanedText,
  useLLM,
  isCopied,
  onCopy,
  isOriginalExpanded,
  onToggleOriginal,
}: TranscriptionResultsProps) {
  if (!isProcessing && !rawText) return null;

  return (
    <div className="flex flex-col gap-3">
      <Box
        header="Original Transcription"
        icon={FileText}
        collapsible
        isExpanded={isOriginalExpanded}
        onToggleExpanded={onToggleOriginal}
      >
        <TextBox
          variant="display"
          value={rawText ?? ''}
          isLoading={isProcessing}
          showCopyButton={!useLLM && !!rawText}
          isCopied={isCopied}
          onCopy={() => rawText && onCopy(rawText)}
          rows={4}
          maxHeight="200px"
        />
      </Box>

      {useLLM && (cleanedText !== null || isCleaningWithLLM) && (
        <Box header="Cleaned Transcription" icon={Sparkles}>
          <TextBox
            variant="display"
            value={cleanedText ?? ''}
            isLoading={isCleaningWithLLM}
            showCopyButton={!!cleanedText}
            isCopied={isCopied}
            onCopy={() => cleanedText && onCopy(cleanedText)}
            rows={4}
            maxHeight="200px"
          />
        </Box>
      )}
    </div>
  );
}
