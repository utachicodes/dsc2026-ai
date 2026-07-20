'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Play, RotateCcw } from 'lucide-react'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

const EPOCHS = 40
const W = 560
const H = 300
const PAD = 40

type Rate = 'small' | 'good' | 'large'

const RATES: { id: Rate; label: string; lr: string; note: string }[] = [
  { id: 'small', label: 'Trop petit', lr: '0.0005', note: 'Ça apprend, mais douloureusement lentement. Ça peut ne jamais finir à temps.' },
  { id: 'good', label: 'Idéal', lr: '0.005', note: 'La perte descend en douceur et la précision monte vers un haut plateau.' },
  { id: 'large', label: 'Trop grand', lr: '0.05', note: 'Les pas dépassent la cible. La perte rebondit et ne se stabilise jamais.' },
]

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function buildCurves(rate: Rate) {
  const loss: number[] = []
  const acc: number[] = []
  for (let e = 0; e < EPOCHS; e++) {
    let l: number
    if (rate === 'small') {
      l = 0.35 + 2.0 * Math.exp(-e * 0.045) + (seeded(e) - 0.5) * 0.03
    } else if (rate === 'good') {
      l = 0.12 + 2.2 * Math.exp(-e * 0.16) + (seeded(e) - 0.5) * 0.04
    } else {
      const decay = 0.6 + 1.6 * Math.exp(-e * 0.09)
      const wobble = Math.sin(e * 1.1) * (0.35 + 0.25 * seeded(e))
      l = Math.max(0.4, decay + wobble)
    }
    loss.push(Math.max(0.05, l))
    // accuracy loosely inverse to loss, capped per regime
    const cap = rate === 'good' ? 0.97 : rate === 'small' ? 0.74 : 0.68
    const a = Math.min(cap, Math.max(0.1, 1 - loss[e] / 2.6))
    acc.push(a)
  }
  return { loss, acc }
}

export function TrainingSimulator() {
  const [rate, setRate] = useState<Rate>('good')
  const [epoch, setEpoch] = useState(0) // number of epochs revealed
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const { loss, acc } = useMemo(() => buildCurves(rate), [rate])

  useEffect(() => {
    setEpoch(0)
    setRunning(false)
  }, [rate])

  useEffect(() => {
    if (!running) {
      if (timer.current) clearInterval(timer.current)
      return
    }
    timer.current = setInterval(() => {
      setEpoch((e) => {
        if (e >= EPOCHS) {
          setRunning(false)
          return e
        }
        return e + 1
      })
    }, 120)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [running])

  const maxLoss = 2.6
  const xFor = (i: number) => PAD + (i / (EPOCHS - 1)) * (W - PAD * 2)
  const yLoss = (v: number) => PAD + (1 - v / maxLoss) * (H - PAD * 2)
  const yAcc = (v: number) => PAD + (1 - v) * (H - PAD * 2)

  const lossPts = loss.slice(0, Math.max(1, epoch)).map((v, i) => `${xFor(i)},${yLoss(v)}`).join(' ')
  const accPts = acc.slice(0, Math.max(1, epoch)).map((v, i) => `${xFor(i)},${yAcc(v)}`).join(' ')

  const shown = Math.max(0, epoch - 1)
  const curLoss = loss[Math.min(shown, EPOCHS - 1)]
  const curAcc = acc[Math.min(shown, EPOCHS - 1)]
  const done = epoch >= EPOCHS

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-xl border bg-card p-4 md:p-5">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Courbes d'entraînement : perte et précision au fil des époques">
          {/* gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={PAD}
              x2={W - PAD}
              y1={PAD + t * (H - PAD * 2)}
              y2={PAD + t * (H - PAD * 2)}
              stroke="var(--grid)"
              strokeWidth={1}
            />
          ))}
          {/* axes labels */}
          <text x={PAD} y={H - 12} fill="var(--muted-foreground)" fontSize="11" fontFamily="monospace">
            époque 0
          </text>
          <text x={W - PAD} y={H - 12} fill="var(--muted-foreground)" fontSize="11" fontFamily="monospace" textAnchor="end">
            époque {EPOCHS}
          </text>

          {/* accuracy line */}
          <polyline points={accPts} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinejoin="round" />
          {/* loss line */}
          <polyline points={lossPts} fill="none" stroke="var(--rgb-red)" strokeWidth={2.5} strokeLinejoin="round" />

          {epoch > 0 && (
            <>
              <circle cx={xFor(shown)} cy={yAcc(curAcc)} r={4} fill="var(--primary)" />
              <circle cx={xFor(shown)} cy={yLoss(curLoss)} r={4} fill="var(--rgb-red)" />
            </>
          )}
        </svg>
        <div className="mt-2 flex items-center justify-center gap-6 font-mono text-xs">
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full" style={{ backgroundColor: 'var(--rgb-red)' }} /> perte
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-block h-2 w-4 rounded-full bg-primary" /> précision
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Taux d’apprentissage</div>
          <div className="flex flex-col gap-2">
            {RATES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRate(r.id)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-left transition-colors',
                  rate === r.id
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border bg-secondary hover:border-muted-foreground/40',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{r.label}</span>
                  <span className="font-mono text-xs text-primary">lr = {r.lr}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{RATES.find((r) => r.id === rate)!.note}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Metric label="époque" value={`${Math.min(epoch, EPOCHS)}`} />
          <Metric label="perte" value={epoch > 0 ? curLoss.toFixed(2) : '--'} tone="red" />
          <Metric label="précision" value={epoch > 0 ? `${Math.round(curAcc * 100)}%` : '--'} tone="primary" />
        </div>

        <BitProgress value={(Math.min(epoch, EPOCHS) / EPOCHS) * 100} variant="retro" className="h-2.5 w-full" />

        <div className="flex items-center gap-2.5">
          <BitButton
            onClick={() => {
              if (done) setEpoch(0)
              setRunning((r) => !r)
            }}
            font="normal"
            className="flex-1 gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <Play className="h-4 w-4" /> {running ? 'Entraînement...' : done ? 'Réentraîner' : 'Entraîner le modèle'}
          </BitButton>
          <BitButton
            onClick={() => {
              setRunning(false)
              setEpoch(0)
            }}
            variant="secondary"
            font="normal"
            className="gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <RotateCcw className="h-4 w-4" />
          </BitButton>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'red' | 'primary' }) {
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <div
        className={cn(
          'font-mono text-xl font-bold md:text-2xl',
          tone === 'default' && 'text-foreground',
          tone === 'red' && 'text-[var(--rgb-red)]',
          tone === 'primary' && 'text-primary',
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}
