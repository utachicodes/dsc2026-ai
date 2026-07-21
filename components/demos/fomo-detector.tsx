'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'

const GRID = 8

type Obj = { id: string; label: string; cx: number; cy: number; r: number; color: string; conf: number }

const OBJECTS: Obj[] = [
  { id: 'pomme', label: 'Pomme', cx: 27, cy: 32, r: 15, color: 'var(--rgb-red)', conf: 0.91 },
  { id: 'banane', label: 'Banane', cx: 68, cy: 26, r: 13, color: 'oklch(0.78 0.15 95)', conf: 0.86 },
  { id: 'patate', label: 'Patate', cx: 50, cy: 72, r: 16, color: 'oklch(0.55 0.08 70)', conf: 0.79 },
]

/**
 * Illustrates the classification vs detection gap. In classification mode
 * the scene collapses to one label, silently dropping the other objects. In
 * detection mode a grid sweeps the frame like a scanner, then each object
 * collapses to a single centroid dot, the way FOMO actually works: no boxes,
 * just "something is here."
 */
export function FomoDetector() {
  const [mode, setMode] = useState<'classification' | 'detection'>('classification')
  const [scanRow, setScanRow] = useState(-1)
  const [scanning, setScanning] = useState(false)
  const [revealed, setRevealed] = useState<string[]>([])
  const raf = useRef<ReturnType<typeof setInterval> | null>(null)

  function runDetection() {
    setRevealed([])
    setScanning(true)
    setScanRow(0)
    if (raf.current) clearInterval(raf.current)
    raf.current = setInterval(() => {
      setScanRow((r) => {
        if (r >= GRID - 1) {
          if (raf.current) clearInterval(raf.current)
          setScanning(false)
          OBJECTS.forEach((o, i) => {
            setTimeout(() => setRevealed((prev) => [...prev, o.id]), 120 + i * 260)
          })
          return r
        }
        return r + 1
      })
    }, 90)
  }

  function reset() {
    if (raf.current) clearInterval(raf.current)
    setScanning(false)
    setScanRow(-1)
    setRevealed([])
  }

  useEffect(() => reset, [mode])
  useEffect(() => () => { if (raf.current) clearInterval(raf.current) }, [])

  const cellOf = (obj: Obj) => ({
    col: Math.min(GRID - 1, Math.floor((obj.cx / 100) * GRID)),
    row: Math.min(GRID - 1, Math.floor((obj.cy / 100) * GRID)),
  })

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-1 rounded-lg border bg-secondary p-1">
          {(['classification', 'detection'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
                mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'classification' ? 'Classification' : 'Détection FOMO'}
            </button>
          ))}
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-lg border bg-secondary/40"
          role="img"
          aria-label="Scène avec une pomme, une banane et une patate"
        >
          {OBJECTS.map((o) => (
            <div
              key={o.id}
              className="absolute rounded-full opacity-90 transition-opacity duration-300"
              style={{
                left: `${o.cx}%`,
                top: `${o.cy}%`,
                width: `${o.r * 2}%`,
                height: `${o.r * 2}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: o.color,
                opacity: mode === 'classification' && o.id !== 'pomme' ? 0.35 : 0.9,
              }}
              aria-hidden
            />
          ))}

          {mode === 'detection' && (
            <div
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, gridTemplateRows: `repeat(${GRID}, 1fr)` }}
              aria-hidden
            >
              {Array.from({ length: GRID * GRID }).map((_, i) => {
                const row = Math.floor(i / GRID)
                const active = scanning && row === scanRow
                return (
                  <div
                    key={i}
                    className={cn(
                      'border border-foreground/10 transition-colors duration-150',
                      active && 'border-primary/60 bg-primary/15',
                    )}
                  />
                )
              })}
            </div>
          )}

          {mode === 'detection' &&
            OBJECTS.map((o) => {
              const isRevealed = revealed.includes(o.id)
              return (
                <div
                  key={o.id}
                  className="absolute flex flex-col items-center transition-all duration-500 ease-out"
                  style={{
                    left: `${o.cx}%`,
                    top: `${o.cy}%`,
                    transform: isRevealed ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.2)',
                    opacity: isRevealed ? 1 : 0,
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: o.color, boxShadow: '0 0 0 2px var(--primary)' }}
                  />
                  <span className="mt-1 rounded bg-background/90 px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-sm">
                    {o.label} {Math.round(o.conf * 100)}%
                  </span>
                </div>
              )
            })}

          {mode === 'classification' && (
            <div className="absolute inset-x-3 bottom-3 rounded-lg border border-destructive/40 bg-background/90 p-2.5 text-center">
              <div className="font-mono text-xs uppercase tracking-wider text-destructive">Résultat unique</div>
              <div className="text-sm text-foreground">
                « Pomme » <span className="text-muted-foreground">, la banane et la patate ne sont pas mentionnées</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2.5">
          {mode === 'detection' ? (
            <>
              <BitButton onClick={runDetection} font="normal" className="gap-2 font-mono text-xs uppercase tracking-wider">
                Lancer la détection
              </BitButton>
              <BitButton onClick={reset} variant="secondary" font="normal" className="font-mono text-xs uppercase tracking-wider">
                Réinitialiser
              </BitButton>
            </>
          ) : (
            <p className="text-center font-mono text-xs text-muted-foreground">
              Un seul label pour toute l&apos;image, quel que soit le nombre d&apos;objets réels.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Ce qui se passe</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            En classification, le modèle regarde toute l&apos;image et rend un seul label. En détection, l&apos;image
            est découpée en une grille de {GRID} sur {GRID}
            {' '}cellules. Chaque cellule reçoit une petite probabilité
            &quot;objet ici&quot;, et les cellules voisines à forte probabilité fusionnent en un seul point, le{' '}
            <span className="text-foreground">centroïde</span>
            {' '}de l&apos;objet.
          </p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">Pourquoi pas une boîte</div>
          <p className="text-pretty text-sm leading-relaxed text-foreground">
            Prédire une boîte englobante coûte beaucoup de mémoire. FOMO ne prédit qu&apos;un centre par objet, ce qui
            suffit pour compter, trier ou déclencher une action, et ce qui tient dans les quelques centaines de
            kilooctets de RAM d&apos;un microcontrôleur.
          </p>
        </div>
      </div>
    </div>
  )
}
