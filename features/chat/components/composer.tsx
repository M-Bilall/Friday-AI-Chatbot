"use client";

import { useRef, useState } from 'react';
import { LoaderCircle, Paperclip, SendHorizonal, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function Composer({
  onSend,
  onStop,
  busy,
  value,
  onValueChange
}: {
  onSend: (value: { message: string; attachments: File[]; model?: string }) => Promise<void>;
  onStop?: () => void;
  busy: boolean;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || busy) return;
    await onSend({ message: trimmed, attachments });
    onValueChange('');
    setAttachments([]);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <Textarea
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="Message Friday"
        className="min-h-[112px] resize-none border-none bg-transparent px-2 py-3 text-[15px] text-white placeholder:text-white/35 focus-visible:ring-0"
      />
      {attachments.length ? (
        <div className="mt-2 flex flex-wrap gap-2 px-2">
          {attachments.map((attachment, index) => (
            <span key={`${attachment.name}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {attachment.name}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex items-center justify-between gap-3 px-2 pb-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" type="button" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
            <Paperclip className="h-4 w-4" />
            Attach
          </Button>
          {busy && onStop ? (
            <Button variant="ghost" type="button" size="sm" onClick={onStop} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              setAttachments((current) => [...current, ...files]);
              event.currentTarget.value = '';
            }}
          />
        </div>
        <Button type="submit" disabled={busy || !value.trim()} className="rounded-full px-4">
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
          Send
        </Button>
      </div>
    </form>
  );
}