'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

const BASE = 47

type Effect = { id: string; label: string; mult: number; detail: string }

const EFFECTS: Effect[] = [
  { id: 'flip', label: 'Flip', mult: 2, detail: 'horizontal mirror' },
  { id: 'brightness', label: 'Brightness', mult: 3, detail: '3 light levels' },
  { id: 'crop', label: 'Crop', mult: 3, detail: 'random windows' },
  { id: 'rotate', label: 'Rotate', mult: 2, detail: 'small angles' },
  { id: 'scale', label: 'Scale', mult: 2, detail: 'zoom in / out' },
]

const SAMPLE_MAX = BASE * 2 * 3 * 3 * 2 * 2

/**
 * Data augmentation playground. Each toggle adds a random variation that the
 * training loop can generate for free, so 47 real photos become thousands of
 * training samples — the trick that keeps FOMO from memorizing one scene.
 */
export function DataAugmentation() {
  const [on, setOn] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setOn((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const mult = EFFECTS.reduce((acc, e) => acc * (on[e.id] ? e.mult : 1), 1)
  const samples = BASE * mult
  const chain = EFFECTS.filter((e) => on[e.id])

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <div className="rounded-xl border bg-card p-3 md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">One training photo</div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#fb923c]" aria-hidden />
            <span className="text-muted-foreground">orange = fruit</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-lg border bg-secondary/40">
          <div
            className="absolute inset-0 grid place-items-center"
            style={{
              transform: on['crop'] ? 'scale(1.45)' : undefined,
              transition: 'transform 400ms ease',
            }}
          >
            <svg
              viewBox="0 0 32 32"
              className="w-1/2"
              aria-hidden
              style={{
                transform: [
                  on['rotate'] ? 'rotate(18deg)' : undefined,
                  on['flip'] ? 'scaleX(-1)' : undefined,
                  on['scale'] ? 'scale(1.18)' : undefined,
                ]
                  .filter(Boolean)
                  .join(' '),
                transition: 'transform 400ms ease',
              }}
            >
              <circle cx="16" cy="17" r="12" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
              <ellipse cx="11" cy="13" rx="4.5" ry="3" fill="#ffedd5" opacity="0.55" />
              <path d="M16 7c1.5-2.6 3.6-3.2 5-2.2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="19.5" cy="3.8" rx="3.2" ry="1.8" fill="#4ade80" transform="rotate(18 19.5 3.8)" />
            </svg>
          </div>
          {on['brightness'] ? (
            <div
              className="pointer-events-none absolute inset-0 bg-white"
              aria-hidden
              style={{ opacity: on['brightness'] ? 0.28 : 0 }}
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 p-2">
            {on['flip'] ? <Chip>flip</Chip> : null}
            {on['brightness'] ? <Chip>bright</Chip> : null}
            {on['crop'] ? <Chip>crop</Chip> : null}
            {on['rotate'] ? <Chip>rot</Chip> : null}
            {on['scale'] ? <Chip>zoom</Chip> : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Augmentation switcher
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {EFFECTS.map((e) => {
              const active = !!on[e.id]
              return (
                <button
                  key={e.id}
                  onClick={() => toggle(e.id)}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors',
                    active ? 'border-primary/60 bg-primary/10' : 'border-border bg-secondary hover:border-muted-foreground/40',
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">{e.label}</span>
                    <span className="block text-xs text-muted-foreground">{e.detail}</span>
                  </span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 text-transparent',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each toggle multiplies the effective dataset for training. The same variations — flip, brightness, crop —
            are applied randomly to every real photo.
          </p>
        </div>

        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">Training samples</div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-bold text-primary md:text-4xl">{samples.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/ {SAMPLE_MAX.toLocaleString()} max</span>
          </div>
          <div className="mt-2 font-mono text-xs text-muted-foreground">
            {BASE} real photos {chain.length ? (
              <>
                {' '}
                × {chain.map((e) => `×${e.mult}`).join(' ')}
              </>
            ) : null}
          </div>
          <div className="mt-2">
            <BitProgress value={(samples / SAMPLE_MAX) * 100} variant="retro" className="h-2 w-full" />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {on['flip'] || on['brightness'] || on['crop'] || on['rotate'] || on['scale']
              ? 'A tiny dataset no longer looks so tiny — augmentation did the math for you.'
              : 'With no augmentation, FOMO only ever sees these exact 47 photos.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground shadow-sm">
      {children}
    </span>
  )
}
