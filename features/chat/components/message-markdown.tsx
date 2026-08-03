"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="group relative my-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copyCode}
        className="absolute right-3 top-3 z-10 h-8 rounded-full border border-white/10 bg-[#0d1622]/85 px-3 text-xs text-white/70 opacity-0 shadow-lg shadow-black/25 backdrop-blur group-hover:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <pre className="overflow-x-auto rounded-[1.35rem] border border-white/10 bg-[#07101b] p-4 text-sm leading-7 text-slate-100 shadow-inner shadow-black/30">
        <code className={className} {...{ children }}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MessageMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ className, children, ...props }) {
          const isInline = !className;
          return isInline ? (
            <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.92em] text-white" {...props}>
              {children}
            </code>
          ) : (
            <CodeBlock className={className}>{children}</CodeBlock>
          );
        },
        pre({ children }) {
          return <pre className="overflow-x-auto rounded-[1.35rem] border border-white/10 bg-[#07101b] p-4 text-sm leading-7 text-slate-100 shadow-inner shadow-black/30">{children}</pre>;
        },
        p({ children }) {
          return <p className="whitespace-pre-wrap leading-7 text-white/90">{children}</p>;
        },
        a({ children, href }) {
          return (
            <a href={href} className="text-sky-300 underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}