'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import RecordButton from './RecordButton';
import UploadZone from './UploadZone';
import TextInputZone from './TextInputZone';
import SettingsPanel from './SettingsPanel';
import TranscriptionResults from './TranscriptionResults';
import ErrorMessage from './ErrorMessage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaningWithLLM, setIsCleaningWithLLM] = useState(false);
  const [rawText, setRawText] = useState<string | null>(null);
  const [cleanedText, setCleanedText] = useState<string | null>(null);
  const [useLLM, setUseLLM] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isKeyDownRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default system prompt on startup
  useEffect(() => {
    setIsLoadingPrompt(true);
    fetch(`${API_BASE}/api/system-prompt`)
      .then((res) => res.json())
      .then((data) => setSystemPrompt(data.default_prompt))
      .catch(() => setError('Failed to load system prompt'))
      .finally(() => setIsLoadingPrompt(false));
  }, []);

  const uploadAudio = useCallback(
    async (blob: Blob) => {
      setError(null);
      try {
        // Phase 1: transcribe
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        const transcribeRes = await fetch(`${API_BASE}/api/transcribe`, {
          method: 'POST',
          body: formData,
        });
        if (!transcribeRes.ok) throw new Error('Transcription failed');
        const transcribeData = await transcribeRes.json();
        setRawText(transcribeData.text);
        setCleanedText(null);
        setIsProcessing(false);

        // Phase 2: clean with LLM (if enabled)
        if (useLLM) {
          setIsCleaningWithLLM(true);
          const cleanRes = await fetch(`${API_BASE}/api/clean`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: transcribeData.text,
              system_prompt: systemPrompt || undefined,
            }),
          });
          if (!cleanRes.ok) throw new Error('LLM cleaning failed');
          const cleanData = await cleanRes.json();
          setCleanedText(cleanData.text);
          setIsCleaningWithLLM(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsProcessing(false);
        setIsCleaningWithLLM(false);
      }
    },
    [useLLM, systemPrompt]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        uploadAudio(blob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError('Microphone access denied');
    }
  }, [uploadAudio]);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);
  }, []);

  // V key shortcut: hold to record
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'v') return;
      if (e.repeat) return;
      if (isKeyDownRef.current) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      isKeyDownRef.current = true;
      startRecording();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'v') return;
      isKeyDownRef.current = false;
      stopRecording();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startRecording, stopRecording]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('audio/')) {
        setIsProcessing(true);
        uploadAudio(file);
      }
    },
    [uploadAudio]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsProcessing(true);
        uploadAudio(file);
      }
      e.target.value = '';
    },
    [uploadAudio]
  );

  const handleTextSubmit = useCallback(
    async (text: string) => {
      setError(null);
      setRawText(text);
      setCleanedText(null);
      if (!useLLM) return;
      setIsCleaningWithLLM(true);
      try {
        const res = await fetch(`${API_BASE}/api/clean`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, system_prompt: systemPrompt || undefined }),
        });
        if (!res.ok) throw new Error('LLM cleaning failed');
        const data = await res.json();
        setCleanedText(data.text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsCleaningWithLLM(false);
      }
    },
    [useLLM, systemPrompt]
  );

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  const isBusy = isProcessing || isCleaningWithLLM;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Listener AI</h1>
          <p className="text-sm text-zinc-500 mt-1">Transcribe with Whisper · Clean with Ollama</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <div className="grid grid-cols-[auto_1fr] gap-4 items-stretch">
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStart={startRecording}
            onStop={stopRecording}
          />
          <UploadZone
            isProcessing={isBusy}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isBusy && fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />
        </div>

        <TextInputZone isProcessing={isBusy} onTextSubmit={handleTextSubmit} />

        <SettingsPanel
          useLLM={useLLM}
          onUseLLMChange={setUseLLM}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
          isLoadingPrompt={isLoadingPrompt}
        />

        <TranscriptionResults
          isProcessing={isProcessing}
          isCleaningWithLLM={isCleaningWithLLM}
          rawText={rawText}
          cleanedText={cleanedText}
          useLLM={useLLM}
          isCopied={isCopied}
          onCopy={handleCopy}
          isOriginalExpanded={isOriginalExpanded}
          onToggleOriginal={() => setIsOriginalExpanded((p) => !p)}
        />
      </div>
    </div>
  );
}
