'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Obj = { label: 'fruit' | 'bug'; cx: number; cy: number; r: number }

const OBJECTS: Obj[] = [
  { label: 'fruit', cx: 30, cy: 42, r: 15 },
  { label: 'fruit', cx: 70, cy: 36, r: 13 },
  { label: 'bug', cx: 52, cy: 74, r: 12 },
]

function FruitShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="17" r="12" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
      <ellipse cx="11" cy="13" rx="4.5" ry="3" fill="#ffedd5" opacity="0.55" />
      <path d="M16 7c1.5-2.6 3.6-3.2 5-2.2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="19.5" cy="3.8" rx="3.2" ry="1.8" fill="#4ade80" transform="rotate(18 19.5 3.8)" />
    </svg>
  )
}

function BugShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse cx="16" cy="20" rx="11" ry="8.5" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="10.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="11.5" cy="15.5" r="1.5" fill="#052e16" />
      <circle cx="21.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="22.5" cy="15.5" r="1.5" fill="#052e16" />
      <path d="M13 23.5c1.8 1.6 4.2 1.6 6 0" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Shows the whole point of labeling: the same camera frame without and with
 * bounding boxes. Boxes are "ground truth" — the correct answers a human
 * gives, and the pattern the model copies.
 */
export function BoxLesson() {
  const [labeled, setLabeled] = useState(false)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-xl border bg-card p-3 md:p-4">
        <div className="mb-3 flex items-center gap-1 rounded-lg border bg-secondary p-1">
          {(['raw', 'labeled'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setLabeled(m === 'labeled')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
                (m === 'labeled') === labeled
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'raw' ? 'Raw photo' : 'Labeled for training'}
            </button>
          ))}
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[min(250px,30vh)] overflow-hidden rounded-lg border bg-secondary/40"
          role="img"
          aria-label="A camera frame with oranges and a frog, with or without bounding boxes"
        >
          {OBJECTS.map((o, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${o.cx}%`,
                top: `${o.cy}%`,
                width: `${o.r * 2.4}%`,
                height: `${o.r * 2.4}%`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-hidden
            >
              {o.label === 'fruit' ? <FruitShape className="h-full w-full" /> : <BugShape className="h-full w-full" />}
            </div>
          ))}

          {labeled
            ? OBJECTS.map((o, i) => (
                <div
                  key={`box-${i}`}
                  className="absolute rounded-sm border-2 border-dashed transition-all duration-300"
                  style={{
                    left: `${o.cx - o.r}%`,
                    top: `${o.cy - o.r}%`,
                    width: `${o.r * 2}%`,
                    height: `${o.r * 2}%`,
                    borderColor: o.label === 'fruit' ? '#fb923c' : '#4ade80',
                  }}
                  aria-hidden
                >
                  <span
                    className="absolute -top-2.5 left-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white"
                    style={{ backgroundColor: o.label === 'fruit' ? '#c2410c' : '#15803d' }}
                  >
                    {o.label}
                  </span>
                </div>
              ))
            : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Ground truth</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every box you draw is a <span className="text-foreground">correct answer</span> for the model: “there is a
            fruit, and it is <em>here</em>.” Draw it 50 times and the model learns the pattern behind the boxes.
          </p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">Training → prediction</div>
          <p className="text-pretty text-sm leading-relaxed text-foreground">
            During training, the boxes teach. At runtime, the model draws its own boxes on live camera frames — no
            human needed anymore.
          </p>
        </div>
      </div>
    </div>
  )
}
