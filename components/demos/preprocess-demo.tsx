'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Obj = { label: 'fruit' | 'bug'; cx: number; cy: number; r: number }

const OBJECTS: Obj[] = [
  { label: 'fruit', cx: 20, cy: 28, r: 12 },
  { label: 'fruit', cx: 52, cy: 22, r: 13 },
  { label: 'fruit', cx: 74, cy: 40, r: 11 },
  { label: 'fruit', cx: 36, cy: 60, r: 12 },
  { label: 'bug', cx: 66, cy: 72, r: 10 },
  { label: 'bug', cx: 84, cy: 68, r: 9 },
  { label: 'bug', cx: 14, cy: 64, r: 9 },
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

const CELLS = 16

/**
 * Shows the impulse preprocessing chain: a 320x240 RGB frame is squashed
 * (not cropped) to 96x96, then converted to grayscale — 9,216 features per
 * image that FOMO will learn from.
 */
export function PreprocessDemo() {
  const [gray, setGray] = useState(false)
  const [squash, setSquash] = useState(false)

  const cells = useMemo(() => {
    const arr: { x: number; y: number; l: number }[] = []
    for (let i = 0; i < CELLS; i++) {
      for (let j = 0; j < CELLS; j++) {
        const cx = ((i + 0.5) / CELLS) * 100
        const cy = ((j + 0.5) / CELLS) * 100
        let l = 0.93
        for (const o of OBJECTS) {
          if (Math.hypot(cx - o.cx, cy - o.cy) < o.r) {
            l = o.label === 'fruit' ? 0.52 : 0.68
            break
          }
        }
        arr.push({ x: i, y: j, l })
      }
    }
    return arr
  }, [])

  return (
    <div className="rounded-xl border bg-card p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSquash((s) => !s)}
          className={cn(
            'rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
            squash ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
          )}
        >
          Squash to square (no crop)
        </button>
        <button
          onClick={() => setGray((g) => !g)}
          className={cn(
            'rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
            gray ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
          )}
        >
          Grayscale
        </button>
        <span className="ml-auto font-mono text-xs text-muted-foreground">320×240 RGB → 96×96 ×1 channel</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <Panel
          label="Raw frame"
          sub="320 × 240"
          className={squash ? 'aspect-square w-32' : 'aspect-[4/3] w-44'}
          content={<Scene color aspect={squash ? 1 : 4 / 3} />}
        />
        <ArrowRight className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
        <Panel
          label={gray ? 'Gray blocks' : 'Squashed'}
          sub={gray ? '96 × 96 · grayscale' : '96 × 96'}
          className="aspect-square w-32"
          content={
            gray ? (
              <div className="relative h-full w-full" aria-hidden>
                {cells.map((c) => (
                  <div
                    key={`${c.x}-${c.y}`}
                    className="absolute"
                    style={{
                      left: `${(c.x / CELLS) * 100}%`,
                      top: `${(c.y / CELLS) * 100}%`,
                      width: `${100 / CELLS}%`,
                      height: `${100 / CELLS}%`,
                      backgroundColor: `rgb(${Math.round(c.l * 255)}, ${Math.round(c.l * 255)}, ${Math.round(c.l * 255)})`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Scene color aspect={1} />
            )
          }
        />
        <ArrowRight className="h-5 w-5 shrink-0 text-primary/70" aria-hidden />
        <Panel
          label="Features"
          sub="9,216 numbers"
          className="aspect-square w-32"
          content={
            <div className="flex h-full w-full items-center justify-center gap-1.5">
              {[0.2, 0.45, 0.7, 0.9].map((l, i) => (
                <span
                  key={i}
                  className="inline-block h-5 w-3 rounded-sm"
                  style={{ backgroundColor: `rgb(${Math.round(l * 255)}, ${Math.round(l * 255)}, ${Math.round(l * 255)})` }}
                />
              ))}
              <span className="font-mono text-xs text-muted-foreground">…</span>
            </div>
          }
        />
      </div>
    </div>
  )
}

function Panel({
  label,
  sub,
  className,
  content,
}: {
  label: string
  sub: string
  className: string
  content: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn('overflow-hidden rounded-lg border bg-secondary/40 transition-all duration-500 ease-out', className)}>
        {content}
      </div>
      <div className="text-center">
        <div className="font-mono text-xs font-medium text-foreground">{label}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{sub}</div>
      </div>
    </div>
  )
}

function Scene({ color, aspect }: { color?: boolean; aspect: number }) {
  const square = aspect === 1
  return (
    <div
      className="relative h-full w-full"
      style={square ? { transform: 'scale(1.18)' } : undefined}
      aria-hidden
    >
      {OBJECTS.map((o, i) => {
        const scale = square ? 1.18 : 1
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${o.cx}%`,
              top: `${o.cy}%`,
              width: `${o.r * 2 * scale}%`,
              aspectRatio: '1 / 1',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {o.label === 'fruit' ? (
              <FruitShape className={cn('h-full w-full', !color && 'grayscale')} />
            ) : (
              <BugShape className={cn('h-full w-full', !color && 'grayscale')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
