'use client'

import { useState } from 'react'
import { Check, Camera, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

type Stage = 0 | 1 | 2

/**
 * Walks through the dataset housekeeping the book describes: the fruit class
 * dominates, so we collect more bug photos, then move a few images to a held
 * out test set. Bars update live so the imbalance is visible.
 */
export function DatasetBalancer() {
  const [stage, setStage] = useState<Stage>(0)

  const fruit = 40
  const bug = stage >= 1 ? 18 : 7
  const train = stage >= 2 ? 52 : fruit + bug
  const test = stage >= 2 ? 6 : 0
  const maxBar = 52

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Dataset health check</div>
          <span
            className={cn(
              'rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider',
              stage === 0
                ? 'border border-destructive/40 bg-destructive/10 text-destructive'
                : 'border border-primary/40 bg-primary/10 text-primary',
            )}
          >
            {stage === 0 ? 'unbalanced' : stage === 1 ? 'balanced' : 'ready'}
          </span>
        </div>

        <div className="space-y-3">
          <BarRow label="Fruit" count={fruit} color="#fb923c" max={maxBar} />
          <BarRow label="Bug" count={bug} color="#4ade80" max={maxBar} />
          {stage >= 2 ? (
            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <BarRow label="Train" count={train} color="var(--primary)" max={maxBar} />
              <BarRow label="Test" count={test} color="var(--secondary-foreground)" max={maxBar} />
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {stage === 0 &&
            'After labeling, fruit dominates the dataset. A model trained on this would almost never learn a bug.'}
          {stage === 1 && 'Bug photos collected: the two classes are now close enough to train on.'}
          {stage >= 2 &&
            'Six images — 13% of the dataset — are locked away in the test set. FOMO will never train on them.'}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="space-y-3">
            <Step
              index={1}
              icon={<Camera className="h-4 w-4" />}
              title="Collect 11 more bug photos"
              detail="Bug had 7 samples vs 40 fruits — the imbalance had to be fixed."
              done={stage >= 1}
              action={
                stage === 0 ? (
                  <BitButton onClick={() => setStage(1)} font="normal" className="w-full gap-2 font-mono text-xs uppercase tracking-wider">
                    <Camera className="h-4 w-4" /> Collect photos
                  </BitButton>
                ) : (
                  <DoneTag />
                )
              }
            />
            <Step
              index={2}
              icon={<FlaskConical className="h-4 w-4" />}
              title="Move 6 images to the test set"
              detail="The test set is 13% of the 58 images — never seen during training."
              done={stage >= 2}
              action={
                stage === 1 ? (
                  <BitButton onClick={() => setStage(2)} font="normal" className="w-full gap-2 font-mono text-xs uppercase tracking-wider">
                    <FlaskConical className="h-4 w-4" /> Split data
                  </BitButton>
                ) : stage === 2 ? (
                  <DoneTag />
                ) : (
                  <BitButton disabled font="normal" className="w-full font-mono text-xs uppercase tracking-wider">
                    Wait for step 1
                  </BitButton>
                )
              }
            />
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>58 images</span>
              <span>train {train} · test {test}</span>
            </div>
            <BitProgress
              value={stage === 0 ? 10 : stage === 1 ? 55 : 100}
              variant="retro"
              className="h-2.5 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function BarRow({ label, count, color, max }: { label: string; count: number; color: string; max: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-xs">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{count}</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded border bg-secondary/60">
        <div
          className="h-full rounded-r transition-all duration-700 ease-out"
          style={{ width: `${(count / max) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function Step({
  index,
  icon,
  title,
  detail,
  done,
  action,
}: {
  index: number
  icon: React.ReactNode
  title: string
  detail: string
  done: boolean
  action: React.ReactNode
}) {
  return (
    <div className={cn('rounded-lg border p-3.5 transition-colors', done ? 'border-primary/40 bg-primary/5' : 'border-border bg-secondary/40')}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2',
            done ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 text-muted-foreground',
          )}
        >
          {done ? <Check className="h-4 w-4" /> : <span className="font-mono text-xs">{index}</span>}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            {icon}
            {title}
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
        </span>
      </div>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}

function DoneTag() {
  return (
    <div className="w-full rounded border border-primary/40 bg-primary/10 px-3 py-2 text-center font-mono text-xs uppercase tracking-wider text-primary">
      Done
    </div>
  )
}
