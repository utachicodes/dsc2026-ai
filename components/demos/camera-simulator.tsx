'use client'

import { useEffect, useState } from 'react'
import { ImagePlus, Video } from 'lucide-react'
import { cn } from '@/lib/utils'

const SAVE_GOAL = 50

type Obj = { label: 'fruit' | 'bug'; cx: number; cy: number; r: number }

const OBJECTS: Obj[] = [
  { label: 'fruit', cx: 30, cy: 44, r: 15 },
  { label: 'fruit', cx: 68, cy: 38, r: 13 },
  { label: 'bug', cx: 54, cy: 76, r: 12 },
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

function Scene({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
  return (
    <div className="absolute inset-0" aria-hidden>
      {OBJECTS.map((o, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${o.cx + dx}%`,
            top: `${o.cy + dy}%`,
            width: `${o.r * 2.6}%`,
            height: `${o.r * 2.6}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {o.label === 'fruit' ? <FruitShape className="h-full w-full" /> : <BugShape className="h-full w-full" />}
        </div>
      ))}
    </div>
  )
}

/**
 * A pretend copy of the ESP32 CameraWebServer page. Campers start the
 * stream, pick QVGA, and save frames — the exact browser interaction they
 * will use with their own XIAO to collect the 50 training photos.
 */
export function CameraSimulator() {
  const [streaming, setStreaming] = useState(false)
  const [frame, setFrame] = useState(0)
  const [thumbs, setThumbs] = useState<{ id: number; dx: number; dy: number }[]>([])

  useEffect(() => {
    if (!streaming) return
    const t = setInterval(() => setFrame((f) => f + 1), 900)
    return () => clearInterval(t)
  }, [streaming])

  const saved = thumbs.length
  const done = saved >= SAVE_GOAL

  function saveFrame() {
    setThumbs((t) => {
      if (t.length >= SAVE_GOAL) return t
      const i = t.length
      return [...t, { id: Date.now(), dx: (i % 3 - 1) * 5, dy: ((i % 5) - 2) * 3.5 }]
    })
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-3 md:p-4">
      <div className="flex items-center gap-2 rounded-lg border bg-secondary/50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-2 flex-1 truncate rounded bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">
          http://192.168.4.1:81
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => setStreaming((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
            streaming
              ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400'
              : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20',
          )}
        >
          <Video className="h-3.5 w-3.5" />
          {streaming ? 'Stop stream' : 'Start stream'}
        </button>
        <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Resolution
          <span className="rounded border bg-secondary px-2 py-1 text-foreground">QVGA 320×240 ▾</span>
        </label>
      </div>

      <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg border bg-secondary/40">
        <Scene />
        {streaming ? (
          <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live · frame {String(frame).padStart(3, '0')}
          </span>
        ) : (
          <span className="absolute left-2 top-2 rounded bg-background/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            Stream stopped
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={saveFrame}
          disabled={!streaming || done}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
            !streaming || done
              ? 'cursor-not-allowed border-border bg-secondary text-muted-foreground'
              : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20',
          )}
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Save frame
        </button>
        <span className="font-mono text-xs text-muted-foreground">
          Saved <span className="text-foreground">{saved}</span> / {SAVE_GOAL}
        </span>
      </div>

      <div className="mt-3 flex min-h-[52px] items-center gap-2 overflow-x-auto">
        {thumbs.length > 0 ? (
          thumbs.map((th, i) => (
            <div
              key={th.id}
              className="relative aspect-[4/3] w-14 shrink-0 overflow-hidden rounded border bg-secondary/40"
              title={`Photo ${i + 1}`}
            >
              <Scene dx={th.dx} dy={th.dy} />
              <span className="absolute bottom-0 right-0 bg-background/70 px-1 font-mono text-[8px] text-muted-foreground">
                {i + 1}
              </span>
            </div>
          ))
        ) : (
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            Start the stream, then click “Save frame” about 50 times — each click is one training photo.
          </p>
        )}
      </div>

      {done ? (
        <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-center font-mono text-xs uppercase tracking-wider text-primary">
          Dataset ready — 50 photos! Now go to Edge Impulse (Step 2).
        </div>
      ) : null}
    </div>
  )
}
