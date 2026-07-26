'use client'

import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { useQuiz } from '@/components/deck/quiz-context'

const OPTIONS = [
  { token: 'chaud', probability: 62 },
  { token: 'bleu', probability: 24 },
  { token: 'mange', probability: 14 },
]

export function TokenPredictor() {
  const { recordAnswer } = useQuiz()
  const [choice, setChoice] = useState<number | null>(null)

  function choose(index: number) {
    if (choice !== null) return
    setChoice(index)
    recordAnswer('next-token', index === 0)
  }

  return (
    <div className="deck-demo grid gap-4 rounded-xl border border-primary/40 bg-primary/5 p-4 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">À vous de prédire le prochain morceau</div>
        <div className="my-5 rounded-lg border bg-background p-5 text-center text-xl md:text-2xl">
          « Sous le soleil, le sable devient très <span className="inline-block min-w-20 border-b-2 border-primary">?</span> »
        </div>
        <div className="grid grid-cols-3 gap-2">
          {OPTIONS.map((option, index) => (
            <BitButton
              key={option.token}
              onClick={() => choose(index)}
              variant={choice === null ? 'secondary' : index === 0 ? 'default' : choice === index ? 'destructive' : 'secondary'}
              font="normal"
              className="justify-center font-mono text-xs uppercase"
            >
              {option.token} {choice !== null ? `${option.probability}%` : ''}
            </BitButton>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-lg border bg-background p-5">
        {choice === null ? (
          <p className="text-sm leading-relaxed text-muted-foreground">ChatGPT reçoit du texte découpé en <span className="text-foreground">tokens</span>. Il calcule quel token pourrait suivre, en choisit un, puis recommence.</p>
        ) : (
          <>
            <div className={cn('flex items-center gap-2 font-mono text-xs uppercase', choice === 0 ? 'text-primary' : 'text-destructive')}>
              {choice === 0 ? <Check className="h-4 w-4" /> : null}{choice === 0 ? 'Le plus probable' : 'Possible, mais moins probable'}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Le modèle ne consulte pas une réponse stockée : il produit une distribution de probabilités. Un texte plausible peut donc être faux.</p>
            <BitButton onClick={() => setChoice(null)} variant="secondary" font="normal" className="mt-4 w-fit gap-2 font-mono text-xs uppercase">
              <RotateCcw className="h-3.5 w-3.5" /> Rejouer
            </BitButton>
          </>
        )}
      </div>
    </div>
  )
}
