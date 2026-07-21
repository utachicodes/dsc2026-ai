'use client'

import { type ReactNode, useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { useQuiz } from './quiz-context'

type Option = { label: ReactNode }

/**
 * A predict-then-reveal challenge: commit to an answer before seeing the
 * mechanism explained or demoed. Scored once per question id via QuizProvider
 * so the deck can show a running score, the guess itself is the point, not
 * just reading the answer.
 */
export function PredictReveal({
  id,
  question,
  options,
  correctIndex,
  explanation,
}: {
  id: string
  question: ReactNode
  options: Option[]
  correctIndex: number
  explanation: ReactNode
}) {
  const { recordAnswer } = useQuiz()
  const [picked, setPicked] = useState<number | null>(null)

  const revealed = picked !== null
  const wasCorrect = picked === correctIndex

  function choose(i: number) {
    if (revealed) return
    setPicked(i)
    recordAnswer(id, i === correctIndex)
  }

  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-5 md:p-6">
      <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">Devinez avant de voir</div>
      <p className="mb-4 text-pretty leading-relaxed text-foreground">{question}</p>
      <div className={cn('grid gap-2.5', options.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex
          const isPicked = picked === i
          const variant = revealed ? (isCorrect ? 'default' : isPicked ? 'destructive' : 'secondary') : 'secondary'
          return (
            <BitButton
              key={i}
              onClick={() => choose(i)}
              variant={variant}
              font="normal"
              className="justify-center gap-2 py-2.5 text-center font-mono text-xs uppercase tracking-wider"
            >
              {opt.label}
              {revealed && isCorrect ? <Check className="h-3.5 w-3.5" /> : null}
              {revealed && isPicked && !isCorrect ? <X className="h-3.5 w-3.5" /> : null}
            </BitButton>
          )
        })}
      </div>
      {revealed ? (
        <div
          className={cn(
            'mt-4 rounded-lg border p-3.5 text-sm leading-relaxed',
            wasCorrect ? 'border-primary/40 bg-background text-foreground' : 'border-destructive/40 bg-background text-foreground',
          )}
        >
          <div
            className={cn(
              'mb-1 font-mono text-xs uppercase tracking-[0.18em]',
              wasCorrect ? 'text-primary' : 'text-destructive',
            )}
          >
            {wasCorrect ? 'Bien vu' : 'Pas tout à fait'}
          </div>
          {explanation}
        </div>
      ) : null}
    </div>
  )
}
