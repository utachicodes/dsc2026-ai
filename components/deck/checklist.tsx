'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

type Step = { id: string; label: string; detail?: string; code?: string }

/**
 * A practical, checkable step list for the workflow and build slides.
 * Progress is saved to localStorage per checklist id, so campers can leave
 * the slide and come back without losing their place.
 */
export function Checklist({ id, title, steps }: { id: string; title?: string; steps: Step[] }) {
  const storageKey = `checklist:${id}`
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) setDone(JSON.parse(raw))
    } catch {
      // ignore
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(done))
    } catch {
      // ignore
    }
  }, [done, hydrated, storageKey])

  const completed = steps.filter((s) => done[s.id]).length
  const pct = steps.length ? (completed / steps.length) * 100 : 0

  function toggle(stepId: string) {
    setDone((prev) => ({ ...prev, [stepId]: !prev[stepId] }))
  }

  function reset() {
    setDone({})
  }

  async function copy(code: string, stepId: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(stepId)
      setTimeout(() => setCopied((c) => (c === stepId ? null : c)), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {title ?? 'Liste pratique'}
        </div>
        <div className="flex items-center gap-3">
          <BitProgress value={pct} variant="retro" className="h-2 w-24" />
          <span className="font-mono text-xs text-muted-foreground">
            {completed}/{steps.length}
          </span>
          <BitButton onClick={reset} variant="secondary" size="sm" font="normal" className="gap-1">
            <RotateCcw className="h-3 w-3" />
          </BitButton>
        </div>
      </div>

      <ul className="space-y-2.5">
        {steps.map((step) => {
          const isDone = !!done[step.id]
          return (
            <li
              key={step.id}
              className={cn(
                'rounded-lg border p-3.5 transition-colors',
                isDone ? 'border-primary/40 bg-primary/5' : 'border-border bg-secondary/40',
              )}
            >
              <button onClick={() => toggle(step.id)} className="flex w-full items-start gap-3 text-left">
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    isDone ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40',
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="flex-1">
                  <span className={cn('block text-sm font-medium', isDone ? 'text-muted-foreground line-through' : 'text-foreground')}>
                    {step.label}
                  </span>
                  {step.detail ? <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{step.detail}</span> : null}
                </span>
              </button>
              {step.code ? (
                <div className="relative mt-3 ml-8">
                  <pre className="overflow-x-auto rounded-lg border bg-secondary/60 p-3 pr-16 font-mono text-xs leading-relaxed text-foreground">
                    {step.code}
                  </pre>
                  <button
                    onClick={() => copy(step.code!, step.id)}
                    className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copied === step.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === step.id ? 'Copié' : 'Copier'}
                  </button>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      {completed === steps.length && steps.length > 0 ? (
        <div className="mt-4 rounded-lg border border-primary/40 bg-primary/5 p-3 text-center font-mono text-xs uppercase tracking-wider text-primary">
          Mission terminée
        </div>
      ) : null}
    </div>
  )
}
