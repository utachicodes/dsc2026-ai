'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'

const CELLS = 64

export function GpuRace() {
  const [cpu, setCpu] = useState(0)
  const [gpu, setGpu] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    timer.current = setInterval(() => {
      setCpu((value) => Math.min(CELLS, value + 1))
      setGpu((value) => Math.min(CELLS, value + 8))
    }, 95)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [running])

  useEffect(() => {
    if (cpu >= CELLS && gpu >= CELLS) setRunning(false)
  }, [cpu, gpu])

  function reset() {
    setRunning(false)
    setCpu(0)
    setGpu(0)
  }

  return (
    <div className="deck-demo rounded-xl border bg-card p-4">
      <div className="grid grid-cols-2 gap-5">
        <Processor label="CPU" subtitle="Quelques tâches puissantes, l’une après l’autre" done={cpu} tone="muted" />
        <Processor label="GPU" subtitle="Beaucoup de petits calculs en parallèle" done={gpu} tone="primary" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Une image exige la même multiplication sur des milliers de pixels. Le GPU gagne parce qu’il en traite beaucoup à la fois.
        </p>
        <div className="flex gap-2">
          <BitButton onClick={() => { if (cpu >= CELLS) reset(); setRunning(true) }} font="normal" className="gap-2 font-mono text-xs uppercase">
            <Play className="h-4 w-4" /> Lancer la course
          </BitButton>
          <BitButton onClick={reset} variant="secondary" font="normal" aria-label="Réinitialiser">
            <RotateCcw className="h-4 w-4" />
          </BitButton>
        </div>
      </div>
    </div>
  )
}

function Processor({ label, subtitle, done, tone }: { label: string; subtitle: string; done: number; tone: 'muted' | 'primary' }) {
  return (
    <div className={cn('rounded-lg border p-4', tone === 'primary' && 'border-primary/40 bg-primary/5')}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className={cn('font-mono text-2xl font-bold', tone === 'primary' && 'text-primary')}>{label}</span>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="font-mono text-sm">{done}/{CELLS}</span>
      </div>
      <div className="mt-3 grid grid-cols-8 gap-1">
        {Array.from({ length: CELLS }).map((_, index) => (
          <span key={index} className={cn('aspect-square rounded-sm border transition-colors duration-150', index < done ? tone === 'primary' ? 'border-primary bg-primary' : 'border-foreground/40 bg-foreground/60' : 'bg-background')} />
        ))}
      </div>
    </div>
  )
}
