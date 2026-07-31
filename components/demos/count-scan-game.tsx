'use client'

import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, RotateCcw, ScanLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

const GRID = 12

type Obj = { id: string; label: 'fruit' | 'bug'; cx: number; cy: number; r: number; conf: number }

const OBJECTS: Obj[] = [
  { id: 'f1', label: 'fruit', cx: 20, cy: 28, r: 12, conf: 0.91 },
  { id: 'f2', label: 'fruit', cx: 52, cy: 22, r: 13, conf: 0.88 },
  { id: 'f3', label: 'fruit', cx: 74, cy: 40, r: 11, conf: 0.9 },
  { id: 'f4', label: 'fruit', cx: 36, cy: 60, r: 12, conf: 0.86 },
  { id: 'b1', label: 'bug', cx: 66, cy: 72, r: 10, conf: 0.83 },
  { id: 'b2', label: 'bug', cx: 84, cy: 68, r: 9, conf: 0.81 },
  { id: 'b3', label: 'bug', cx: 14, cy: 64, r: 9, conf: 0.8 },
]

const FRUITS = OBJECTS.filter((o) => o.label === 'fruit').length
const BUGS = OBJECTS.filter((o) => o.label === 'bug').length

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
 * Guess-then-scan game. Campers first count the oranges and frogs by eye,
 * then FOMO sweeps the scene as a 12x12 grid and each object collapses to a
 * single centroid — no bounding boxes. The guess is compared to what FOMO
 * finds, making the "what / where / how many" tradeoff concrete.
 */
export function CountScanGame() {
  const [stage, setStage] = useState<'guess' | 'scan' | 'result'>('guess')
  const [guessFruit, setGuessFruit] = useState(0)
  const [guessBug, setGuessBug] = useState(0)
  const [scanRow, setScanRow] = useState(-1)
  const [revealed, setRevealed] = useState<string[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  function reset() {
    if (timer.current) clearInterval(timer.current)
    setStage('guess')
    setGuessFruit(0)
    setGuessBug(0)
    setScanRow(-1)
    setRevealed([])
  }

  function runScan() {
    setStage('scan')
    setScanRow(0)
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setScanRow((r) => {
        if (r >= GRID - 1) {
          if (timer.current) clearInterval(timer.current)
          OBJECTS.forEach((o, i) => {
            setTimeout(() => setRevealed((prev) => (prev.includes(o.id) ? prev : [...prev, o.id])), 150 + i * 220)
          })
          setTimeout(() => setStage('result'), 150 + OBJECTS.length * 220 + 200)
          return r
        }
        return r + 1
      })
    }, 85)
  }

  const fruitRight = guessFruit === FRUITS
  const bugRight = guessBug === BUGS
  const bothRight = fruitRight && bugRight

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
      <div className="rounded-xl border bg-card p-3 md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Conveyor scene · 96×96</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground">
              <span className="h-2 w-2 rounded-full bg-[#fb923c]" /> fruit
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground">
              <span className="h-2 w-2 rounded-full bg-[#4ade80]" /> bug
            </span>
          </div>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[min(300px,36vh)] overflow-hidden rounded-lg border bg-secondary/40"
          role="img"
          aria-label="Scene with oranges and frogs"
        >
          {OBJECTS.map((o) => (
            <div
              key={o.id}
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

          {stage === 'scan' && (
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, gridTemplateRows: `repeat(${GRID}, 1fr)` }}
              aria-hidden
            >
              {Array.from({ length: GRID * GRID }).map((_, i) => {
                const row = Math.floor(i / GRID)
                const active = row === scanRow
                return (
                  <div
                    key={i}
                    className={cn(
                      'border border-foreground/10 transition-colors duration-150',
                      active && 'border-primary/70 bg-primary/25',
                    )}
                  />
                )
              })}
            </div>
          )}

          {OBJECTS.map((o) => {
            const isRevealed = revealed.includes(o.id)
            return (
              <div
                key={`dot-${o.id}`}
                className={cn(
                  'absolute flex flex-col items-center transition-all duration-500 ease-out',
                  stage === 'guess' && 'opacity-0',
                )}
                style={{
                  left: `${o.cx}%`,
                  top: `${o.cy}%`,
                  transform: isRevealed
                    ? 'translate(-50%, -50%) scale(1)'
                    : 'translate(-50%, -50%) scale(0.2)',
                  opacity: isRevealed ? 1 : 0,
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border-2 border-background"
                  style={{
                    backgroundColor: o.label === 'fruit' ? '#fb923c' : '#4ade80',
                    boxShadow: '0 0 0 2px var(--primary)',
                  }}
                />
                <span className="mt-0.5 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-sm">
                  {o.label} {Math.round(o.conf * 100)}%
                </span>
              </div>
            )
          })}

          {stage === 'guess' && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg border border-primary/30 bg-background/90 p-2.5 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Count the oranges and the frogs
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          {stage === 'scan' ? (
            <div className="flex w-full items-center gap-3">
              <BitProgress value={(Math.min(Math.max(scanRow, 0), GRID - 1) / (GRID - 1)) * 100} variant="retro" className="h-2.5 w-full" />
              <span className="shrink-0 font-mono text-xs text-muted-foreground">scanning…</span>
            </div>
          ) : stage === 'result' ? (
            <BitButton onClick={reset} variant="secondary" font="normal" className="gap-2 font-mono text-xs uppercase tracking-wider">
              <RotateCcw className="h-3.5 w-3.5" /> Play again
            </BitButton>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Your guess</div>
          <div className="space-y-2">
            <Stepper value={guessFruit} onChange={setGuessFruit} label="Oranges" />
            <Stepper value={guessBug} onChange={setGuessBug} label="Frogs" />
          </div>
          <BitButton
            onClick={runScan}
            disabled={stage !== 'guess'}
            font="normal"
            className="mt-3 w-full gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <ScanLine className="h-4 w-4" /> Scan with FOMO
          </BitButton>
        </div>

        <div
          className={cn(
            'rounded-xl border p-4 transition-colors',
            stage === 'result' && (bothRight ? 'border-primary/50 bg-primary/5' : 'border-border bg-secondary/40'),
          )}
        >
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">FOMO verdict</div>
          {stage === 'result' ? (
            <div className="space-y-2 text-sm leading-relaxed">
              <p className="text-foreground">
                FOMO found <span className="font-mono text-primary">{FRUITS}</span> orange{FRUITS > 1 ? 's' : ''} and{' '}
                <span className="font-mono text-primary">{BUGS}</span> frog{BUGS > 1 ? 's' : ''}.
              </p>
              <p className={cn('font-medium', bothRight ? 'text-primary' : 'text-muted-foreground')}>
                {bothRight
                  ? 'Perfect count — your eyes and FOMO agree!'
                  : fruitRight && !bugRight
                    ? 'Oranges: spot on. The frogs tricked you.'
                    : bugRight && !fruitRight
                      ? 'Frogs: spot on. Check the oranges again.'
                      : 'Close! Both counts were off — look harder next time.'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              FOMO divides the image into a {GRID}×{GRID} grid, scores every cell, then merges hot zones into one
              centroid per object — class + position, no box, no size.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-secondary px-3 py-2">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <BitButton
          size="sm"
          variant="secondary"
          font="normal"
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`${label}, fewer`}
        >
          <Minus className="h-3.5 w-3.5" />
        </BitButton>
        <span className="w-8 text-center font-mono text-xl font-bold text-primary">{value}</span>
        <BitButton
          size="sm"
          variant="secondary"
          font="normal"
          onClick={() => onChange(Math.min(9, value + 1))}
          aria-label={`${label}, more`}
        >
          <Plus className="h-3.5 w-3.5" />
        </BitButton>
      </div>
    </div>
  )
}
