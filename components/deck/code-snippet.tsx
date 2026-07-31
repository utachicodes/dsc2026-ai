'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A terminal-style code block with a fake window chrome, an optional file
 * name / language badge, and a one-click copy button. Used on the tutorial
 * slides so campers can grab the exact lines they need.
 */
export function CodeSnippet({
  filename,
  badge,
  code,
  className,
}: {
  filename?: string
  badge?: string
  code: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-secondary/60', className)}>
      <div className="flex items-center justify-between gap-3 border-b bg-secondary/80 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-foreground/20" aria-hidden />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-foreground/20" aria-hidden />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-foreground/20" aria-hidden />
          {filename ? <span className="ml-2 truncate font-mono text-xs text-muted-foreground">{filename}</span> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge ? (
            <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              {badge}
            </span>
          ) : null}
          <button
            onClick={copy}
            className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground">{code}</pre>
    </div>
  )
}
