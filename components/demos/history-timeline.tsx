'use client'

import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'

const EVENTS = [
  { year: '1950', label: 'Turing pose la question', detail: '« Une machine peut-elle penser ? »' },
  { year: '1956', label: 'Le mot IA apparaît', detail: 'Atelier de Dartmouth' },
  { year: '1958', label: 'Le perceptron apprend', detail: 'Un ancêtre du neurone artificiel' },
  { year: '1974', label: 'Premier hiver de l’IA', detail: 'Les promesses dépassent les résultats' },
  { year: '2012', label: 'AlexNet change la vision', detail: 'Données + GPU + réseau profond' },
]

const SCRAMBLED = [EVENTS[2], EVENTS[4], EVENTS[0], EVENTS[3], EVENTS[1]]

export function HistoryTimeline() {
  const [picked, setPicked] = useState<number[]>([])
  const [mistake, setMistake] = useState(false)
  const done = picked.length === EVENTS.length

  function choose(eventIndex: number) {
    if (picked.includes(eventIndex) || done) return
    if (eventIndex !== picked.length) {
      setMistake(true)
      return
    }
    setMistake(false)
    setPicked((current) => [...current, eventIndex])
  }

  function reset() {
    setPicked([])
    setMistake(false)
  }

  return (
    <div className="deck-demo rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Défi · du plus ancien au plus récent</div>
          <p className="mt-1 text-sm text-muted-foreground">Cliquez sur les événements dans l’ordre. Les dates apparaissent après votre choix.</p>
        </div>
        <BitButton onClick={reset} variant="secondary" font="normal" className="gap-1.5 font-mono text-xs uppercase">
          <RotateCcw className="h-3.5 w-3.5" /> Recommencer
        </BitButton>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {SCRAMBLED.map((event) => {
          const eventIndex = EVENTS.indexOf(event)
          const selected = picked.includes(eventIndex)
          return (
            <button
              key={event.year}
              onClick={() => choose(eventIndex)}
              disabled={selected}
              className={cn(
                'min-h-24 rounded-lg border p-3 text-left transition-all',
                selected ? 'border-primary/40 bg-primary/10' : 'bg-secondary hover:-translate-y-0.5 hover:border-primary/50',
              )}
            >
              <div className={cn('font-mono text-lg font-bold', selected ? 'text-primary' : 'text-muted-foreground')}>{selected ? event.year : '????'}</div>
              <div className="mt-1 text-sm font-medium">{event.label}</div>
            </button>
          )
        })}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2" aria-live="polite">
        {EVENTS.map((event, index) => {
          const visible = picked.includes(index)
          return (
            <div key={event.year} className={cn('rounded-lg border px-2 py-2 text-center transition-opacity', visible ? 'opacity-100' : 'opacity-25')}>
              <div className="font-mono text-xs text-primary">{visible ? event.year : '—'}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{visible ? event.detail : 'À découvrir'}</div>
            </div>
          )
        })}
      </div>

      <div className={cn('mt-3 flex h-6 items-center gap-2 text-sm', mistake ? 'text-destructive' : done ? 'text-primary' : 'text-muted-foreground')}>
        {done ? <Check className="h-4 w-4" /> : null}
        {mistake ? 'Pas encore : cherchez un événement plus ancien.' : done ? 'Chronologie reconstruite ! Les idées étaient là bien avant les moyens.' : `${picked.length}/5 événements placés`}
      </div>
    </div>
  )
}
