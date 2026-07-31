'use client'

import { type ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * A collapsible "Why?" row. Collapsed it is a single thin bar, so it never
 * crowds a slide; opened it gives a short, plain-language reason behind a
 * step or a number. One expanding block per concept keeps the deck dense
 * but still explorable.
 */
export function Why({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-muted bg-secondary/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-secondary"
      >
        <span className="font-mono text-[9px] uppercase tracking-wider text-primary">Why?</span>
        <span className="flex-1 text-[11px] font-medium leading-tight text-foreground">{question}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div className="border-t border-muted px-3 py-2 text-xs leading-relaxed text-muted-foreground">{children}</div>
      ) : null}
    </div>
  )
}
