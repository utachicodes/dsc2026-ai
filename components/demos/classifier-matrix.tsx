'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { RotateCcw, Zap } from 'lucide-react'
import { Button as BitButton } from '@/components/ui/8bit/button'

const CLASSES = ['Pierre', 'Feuille', 'Ciseaux'] as const
type ClassIdx = 0 | 1 | 2

type Sample = { truth: ClassIdx; probs: [number, number, number] }

// A small "test set". Most are confident and correct; a couple are ambiguous
// so students can see how mistakes end up in the confusion matrix.
const SAMPLES: Sample[] = [
  { truth: 0, probs: [0.94, 0.03, 0.03] },
  { truth: 0, probs: [0.52, 0.09, 0.39] }, // rock mistaken as scissors risk
  { truth: 1, probs: [0.05, 0.9, 0.05] },
  { truth: 1, probs: [0.08, 0.87, 0.05] },
  { truth: 2, probs: [0.12, 0.06, 0.82] },
  { truth: 2, probs: [0.41, 0.05, 0.54] }, // ambiguous scissors
]

function argmax(p: number[]): ClassIdx {
  let m = 0
  for (let i = 1; i < p.length; i++) if (p[i] > p[m]) m = i
  return m as ClassIdx
}

function Glyph({ cls, className }: { cls: ClassIdx; className?: string }) {
  // minimal geometric marks for rock / paper / scissors
  if (cls === 0)
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  if (cls === 1)
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const PRESET_MATRIX: number[][] = [
  [46, 1, 3],
  [2, 48, 0],
  [4, 1, 45],
]

export function ClassifierMatrix() {
  const [active, setActive] = useState<number | null>(null)
  const [matrix, setMatrix] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ])

  const sample = active != null ? SAMPLES[active] : null
  const predicted = sample ? argmax(sample.probs) : null

  function classify(i: number) {
    setActive(i)
    const s = SAMPLES[i]
    const pred = argmax(s.probs)
    setMatrix((m) => {
      const next = m.map((r) => [...r])
      next[s.truth][pred] += 1
      return next
    })
  }

  const total = matrix.flat().reduce((a, b) => a + b, 0)
  const correct = matrix[0][0] + matrix[1][1] + matrix[2][2]
  const maxCell = Math.max(1, ...matrix.flat())

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Classifier */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Choisissez une image test à classer
        </div>
        <div className="grid grid-cols-6 gap-2">
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => classify(i)}
              aria-label={`Classer l’image test ${i + 1}, vraie classe ${CLASSES[s.truth]}`}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border transition-colors',
                active === i
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              <Glyph cls={s.truth} className="h-6 w-6" />
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Sortie du modèle (softmax)
          </div>
          <div className="space-y-3">
            {CLASSES.map((c, i) => {
              const p = sample ? sample.probs[i] : 0
              const isPred = predicted === i
              return (
                <div key={c} className="flex items-center gap-3">
                  <span className={cn('w-16 font-mono text-sm', isPred ? 'text-primary' : 'text-muted-foreground')}>
                    {c}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn('h-full rounded-full transition-[width] duration-500', isPred ? 'bg-primary' : 'bg-muted-foreground/50')}
                      style={{ width: `${p * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-sm text-foreground">{Math.round(p * 100)}%</span>
                </div>
              )
            })}
          </div>
          {sample && predicted != null ? (
            <div
              className={cn(
                'mt-4 rounded-lg border p-3 text-sm',
                predicted === sample.truth
                  ? 'border-primary/40 bg-primary/5 text-foreground'
                  : 'border-destructive/40 bg-destructive/5 text-foreground',
              )}
            >
              Prédit <span className="font-semibold text-primary">{CLASSES[predicted]}</span>, la vraie étiquette
              était <span className="font-semibold">{CLASSES[sample.truth]}</span>.{' '}
              {predicted === sample.truth ? 'Correct.' : 'Une erreur, elle atterrit hors diagonale ci-dessous.'}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Le modèle renvoie une probabilité pour chaque classe. La plus haute l’emporte. Classez quelques images
              et regardez la matrice de confusion se remplir.
            </p>
          )}
        </div>
      </div>

      {/* Confusion matrix */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Matrice de confusion</div>
          <div className="flex items-center gap-2.5">
            <BitButton
              onClick={() => setMatrix(PRESET_MATRIX.map((r) => [...r]))}
              size="sm"
              font="normal"
              className="gap-1.5 font-mono text-[11px] uppercase tracking-wider"
            >
              <Zap className="h-3.5 w-3.5" /> Tout classer
            </BitButton>
            <BitButton
              onClick={() => {
                setMatrix([
                  [0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0],
                ])
                setActive(null)
              }}
              size="sm"
              variant="secondary"
              font="normal"
              className="gap-1.5 font-mono text-[11px] uppercase tracking-wider"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </BitButton>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div />
          <div className="grid grid-cols-3 gap-2">
            {CLASSES.map((c) => (
              <div key={c} className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {c}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="rotate-180 font-mono text-[10px] uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl]">
              réel
            </span>
          </div>
          <div className="space-y-2">
            {matrix.map((row, r) => (
              <div key={r} className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-16 text-right font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {CLASSES[r]}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {row.map((v, c) => {
                    const diag = r === c
                    const intensity = v / maxCell
                    return (
                      <div
                        key={c}
                        className={cn(
                          'flex aspect-square items-center justify-center rounded-lg border font-mono text-lg font-semibold',
                          diag ? 'border-primary/30' : v > 0 ? 'border-destructive/30' : 'border-border',
                        )}
                        style={{
                          backgroundColor: diag
                            ? `color-mix(in oklch, var(--primary) ${intensity * 55}%, var(--card))`
                            : v > 0
                              ? `color-mix(in oklch, var(--destructive) ${intensity * 55}%, var(--card))`
                              : 'var(--card)',
                          color: 'var(--foreground)',
                        }}
                      >
                        {v}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">prédit en haut</span>
          <span className="font-mono text-foreground">
            précision {total > 0 ? `${Math.round((correct / total) * 100)}%` : '--'}
            <span className="text-muted-foreground"> ({correct}/{total})</span>
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          La diagonale verte représente les prédictions correctes. Chaque cellule rouge hors diagonale est une erreur
          précise, qui indique exactement quelles classes le modèle confond.
        </p>
      </div>
    </div>
  )
}
