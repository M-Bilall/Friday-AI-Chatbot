import { Copy, Download, UserRound } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageMarkdown } from '@/features/chat/components/message-markdown';
import { cn } from '@/lib/utils';

export function MessageItem({
  role,
  content,
  timestamp,
  onCopy
}: {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  timestamp?: string;
  onCopy: (value: string) => void;
}) {
  const isAssistant = role === 'ASSISTANT';
  const isSystem = role === 'SYSTEM';

  return (
    <div className={cn('group flex w-full', role === 'USER' ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex w-full max-w-[min(100%,52rem)] gap-3', role === 'USER' && 'flex-row-reverse')}>
        <Avatar className={cn('h-10 w-10 shrink-0 border border-white/10 bg-white/5', isSystem && 'bg-secondary/20')}>
          <AvatarFallback>{role === 'USER' ? <UserRound className="h-4 w-4" /> : 'F'}</AvatarFallback>
        </Avatar>
        <div className={cn('min-w-0 flex-1 space-y-2', role === 'USER' && 'flex flex-col items-end')}>
          <div className={cn('flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/40', role === 'USER' && 'justify-end')}>
            <span>{role === 'USER' ? 'You' : role === 'ASSISTANT' ? 'Friday' : 'System'}</span>
            {timestamp ? <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : null}
          </div>
          <div
            className={cn(
              'rounded-[1.5rem] border px-4 py-3 shadow-sm',
              role === 'USER' ? 'border-white/10 bg-white/7 text-white' : role === 'ASSISTANT' ? 'border-white/10 bg-white/[0.04] text-white/92' : 'border-white/10 bg-white/5 text-white/80'
            )}
          >
            <div className="prose prose-invert max-w-none prose-p:my-3 prose-pre:my-4 prose-code:before:content-none prose-code:after:content-none prose-headings:text-white prose-p:text-inherit prose-li:text-inherit">
              <MessageMarkdown content={content} />
            </div>
          </div>
          <div className={cn('flex gap-2 opacity-0 transition-opacity group-hover:opacity-100', role === 'USER' && 'justify-end')}>
            <Button variant="ghost" size="sm" onClick={() => onCopy(content)} className="h-8 rounded-full text-white/55 hover:bg-white/6 hover:text-white">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="h-8 rounded-full text-white/55 hover:bg-white/6 hover:text-white">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}