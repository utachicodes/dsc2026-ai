'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Why } from '@/components/deck/why'

const EPOCHS = 60

const LOGS = [
  'shuffling the 52 photos…',
  'showing the model a batch of 32 photos…',
  'comparing each guess to your labeled boxes…',
  'taking a tiny step to fix the mistakes…',
  'checking on the 6 test photos we hid away…',
  'background score stays calm — good sign…',
]

function lossAt(epoch: number) {
  const base = 0.9 * Math.exp(-epoch / 22) + 0.06
  const noise = Math.sin(epoch * 1.7) * 0.02
  return Math.max(0.03, base + noise)
}

function f1At(epoch: number) {
  const base = 0.85 * (1 - Math.exp(-epoch / 18))
  const noise = Math.cos(epoch * 2.3) * 0.02
  return Math.min(0.9, base + noise)
}

/**
 * A pretend Edge Impulse training run. Pressing "Start training" plays the
 * real story of 60 epochs: loss goes down, F1 goes up, and a log line
 * explains what the cloud computer is doing at each step.
 */
export function TrainingDemo() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [epoch, setEpoch] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  function start() {
    setStatus('running')
    setEpoch(0)
    timer.current = setInterval(() => {
      setEpoch((e) => {
        if (e + 1 >= EPOCHS) {
          if (timer.current) clearInterval(timer.current)
          setStatus('done')
          return EPOCHS
        }
        return e + 1
      })
    }, 150)
  }

  function reset() {
    if (timer.current) clearInterval(timer.current)
    setStatus('idle')
    setEpoch(0)
  }

  const running = status === 'running'
  const pct = (epoch / EPOCHS) * 100
  const loss = lossAt(epoch)
  const f1 = f1At(epoch)
  const log = LOGS[Math.min(LOGS.length - 1, Math.floor((epoch / EPOCHS) * LOGS.length))]

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          FOMO training · in the cloud
        </div>
        {status === 'done' ? (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Train again
          </button>
        ) : null}
      </div>

      <button
        onClick={start}
        disabled={running}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-sm uppercase tracking-wider transition-colors',
          status === 'done'
            ? 'border-primary/50 bg-primary/10 text-primary'
            : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20',
          running && 'cursor-not-allowed opacity-60',
        )}
      >
        {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {status === 'done' ? 'Done — model ready!' : 'Start training'}
      </button>

      {status === 'idle' ? (
        <div className="space-y-2">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This is what happens when you press “Start training” in Edge Impulse. A powerful cloud computer looks at
            your 52 labeled photos over and over — 60 full passes — and fixes its mistakes each time.
          </p>
          <Why question="What is an epoch?">
            One full look at all of your photos. 60 epochs means the model sees every photo 60 times, correcting its
            guesses a little more on each pass.
          </Why>
          <Why question="What is the learning rate?">
            How big a step the model takes when it fixes a mistake. 0.001 is a small, careful step — steps that are
            too big can jump right past the best answer.
          </Why>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>
              epoch <span className="text-foreground">{String(Math.min(epoch, EPOCHS)).padStart(2, '0')}</span> / {EPOCHS}
            </span>
            <span className="text-primary">{Math.round(pct)}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full border bg-secondary">
            <div
              className="h-full bg-primary transition-[width] duration-150 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-secondary/40 p-2.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Loss</div>
              <div className="font-mono text-lg text-foreground">
                {loss.toFixed(2)}
                <span className="ml-1 text-xs text-muted-foreground">(mistakes ↓)</span>
              </div>
            </div>
            <div className="rounded-lg border bg-secondary/40 p-2.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">F1 score</div>
              <div className="font-mono text-lg text-primary">
                {(f1 * 100).toFixed(0)}%
                <span className="ml-1 text-xs text-muted-foreground">(skill ↑)</span>
              </div>
            </div>
          </div>
          <p className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 font-mono text-[11px] leading-relaxed text-primary">
            &gt; {log}
          </p>
        </div>
      )}

      {status === 'done' ? (
        <div className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-center font-mono text-xs uppercase tracking-wider text-primary">
          F1 = 85% on validation — ready to download!
        </div>
      ) : null}
    </div>
  )
}
