import type { ComponentType, RefObject } from 'react';

export interface TranscriptionResponse {
  success: boolean;
  text: string;
}

export interface CleanTextResponse {
  success: boolean;
  text: string;
}

export interface SystemPromptResponse {
  default_prompt: string;
}

export type RecordingState = 'idle' | 'recording' | 'processing';

export interface AppState {
  isRecording: boolean;
  isProcessing: boolean;
  isCleaningWithLLM: boolean;
  rawText: string | null;
  cleanedText: string | null;
  useLLM: boolean;
  systemPrompt: string;
  isLoadingPrompt: boolean;
  error: string | null;
  isCopied: boolean;
  isDragging: boolean;
  isOriginalExpanded: boolean;
}

export interface BoxProps {
  children: React.ReactNode;
  header?: string;
  icon?: ComponentType<{ className?: string }>;
  collapsible?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export interface UploadZoneProps {
  isProcessing: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextInputZoneProps {
  isProcessing: boolean;
  onTextSubmit: (text: string) => void;
}

export interface SettingsPanelProps {
  useLLM: boolean;
  onUseLLMChange: (value: boolean) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  isLoadingPrompt: boolean;
}

export interface TranscriptionResultsProps {
  isProcessing: boolean;
  isCleaningWithLLM: boolean;
  rawText: string | null;
  cleanedText: string | null;
  useLLM: boolean;
  isCopied: boolean;
  onCopy: (text: string) => void;
  isOriginalExpanded: boolean;
  onToggleOriginal: () => void;
}

export interface TextBoxProps {
  value: string;
  onChange?: (value: string) => void;
  variant: 'input' | 'display';
  isLoading?: boolean;
  isDisabled?: boolean;
  showCopyButton?: boolean;
  isCopied?: boolean;
  onCopy?: () => void;
  rows?: number;
  maxHeight?: string;
  placeholder?: string;
}

export interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}
