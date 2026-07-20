'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

const N = 16 // input grid size
const OUT = N - 2 // valid convolution output size

type Kernel = { name: string; blurb: string; k: number[][]; norm: number }

const KERNELS: Kernel[] = [
  {
    name: 'Contours verticaux',
    blurb: 'S’allume là où la luminosité change de gauche à droite.',
    k: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    norm: 4,
  },
  {
    name: 'Contours horizontaux',
    blurb: 'S’allume là où la luminosité change de haut en bas.',
    k: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
    norm: 4,
  },
  {
    name: 'Netteté',
    blurb: 'Renforce un pixel qui diffère de ses voisins.',
    k: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    norm: 1,
  },
  {
    name: 'Flou',
    blurb: 'Fait la moyenne de chaque pixel avec ses voisins.',
    k: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    norm: 9,
  },
]

// Build a simple, edge-rich input image: a ring with a diagonal bar.
function buildInput(): number[][] {
  const g: number[][] = []
  const c = (N - 1) / 2
  for (let y = 0; y < N; y++) {
    const row: number[] = []
    for (let x = 0; x < N; x++) {
      const d = Math.sqrt((x - c) ** 2 + (y - c) ** 2)
      let v = d > 4.2 && d < 6.4 ? 0.9 : 0.08
      if (Math.abs(x - y) <= 1) v = Math.max(v, 0.85)
      row.push(v)
    }
    g.push(row)
  }
  return g
}

export function ConvolutionDemo() {
  const input = useMemo(buildInput, [])
  const [kernelIdx, setKernelIdx] = useState(0)
  const [pos, setPos] = useState(0) // 0..OUT*OUT (how many output cells computed)
  const [playing, setPlaying] = useState(false)
  const raf = useRef<number | null>(null)
  const last = useRef(0)

  const kernel = KERNELS[kernelIdx]

  const output = useMemo(() => {
    const out: number[][] = []
    for (let y = 0; y < OUT; y++) {
      const row: number[] = []
      for (let x = 0; x < OUT; x++) {
        let sum = 0
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            sum += input[y + ky][x + kx] * kernel.k[ky][kx]
          }
        }
        row.push(sum / kernel.norm)
      }
      out.push(row)
    }
    return out
  }, [input, kernel])

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current)
      return
    }
    const tick = (t: number) => {
      if (t - last.current > 55) {
        last.current = t
        setPos((p) => {
          if (p >= OUT * OUT) {
            setPlaying(false)
            return p
          }
          return p + 1
        })
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing])

  // Reset the sweep whenever the filter changes.
  useEffect(() => {
    setPos(0)
    setPlaying(false)
  }, [kernelIdx])

  const currentOut = Math.min(pos, OUT * OUT - 1)
  const winX = currentOut % OUT
  const winY = Math.floor(currentOut / OUT)
  const done = pos >= OUT * OUT

  function shade(v: number) {
    const g = Math.round(v * 255)
    return `rgb(${g}, ${g}, ${g})`
  }
  function edgeShade(v: number) {
    // map roughly -1..1 to 0..255 for signed responses
    const g = Math.round(Math.min(1, Math.abs(v)) * 255)
    return `rgb(${g}, ${g}, ${g})`
  }

  return (
    <div className="rounded-xl border bg-card p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {KERNELS.map((k, i) => (
          <button
            key={k.name}
            onClick={() => setKernelIdx(i)}
            className={cn(
              'rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors',
              kernelIdx === i
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            {k.name}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* Input */}
        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Image d’entrée</div>
          <div
            className="relative grid overflow-hidden rounded-lg border"
            style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
          >
            {input.flatMap((row, y) =>
              row.map((v, x) => {
                const inWindow = x >= winX && x < winX + 3 && y >= winY && y < winY + 3
                return (
                  <div
                    key={`${x}-${y}`}
                    className="aspect-square"
                    style={{
                      backgroundColor: shade(v),
                      boxShadow: inWindow ? 'inset 0 0 0 1px var(--primary)' : 'none',
                      opacity: inWindow ? 1 : 0.9,
                    }}
                  />
                )
              }),
            )}
            {/* moving window outline */}
            <div
              className="pointer-events-none absolute rounded-[3px] border-2 border-primary transition-all duration-100"
              style={{
                width: `${(3 / N) * 100}%`,
                height: `${(3 / N) * 100}%`,
                left: `${(winX / N) * 100}%`,
                top: `${(winY / N) * 100}%`,
              }}
              aria-hidden
            />
          </div>
        </div>

        {/* Kernel */}
        <div className="flex flex-col items-center justify-center gap-3 lg:pt-8">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Filtre</div>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-primary/40 bg-primary/5 p-2">
            {kernel.k.flat().map((v, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded font-mono text-sm text-foreground"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                {v}
              </div>
            ))}
          </div>
          <p className="max-w-[10rem] text-center text-xs leading-relaxed text-muted-foreground">{kernel.blurb}</p>
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Carte de caractéristiques
          </div>
          <div
            className="grid overflow-hidden rounded-lg border"
            style={{ gridTemplateColumns: `repeat(${OUT}, 1fr)` }}
          >
            {output.flatMap((row, y) =>
              row.map((v, x) => {
                const idx = y * OUT + x
                const computed = idx < pos
                const isCurrent = idx === currentOut && !done
                return (
                  <div
                    key={`${x}-${y}`}
                    className="aspect-square transition-colors duration-150"
                    style={{
                      backgroundColor: computed ? edgeShade(v) : 'var(--background)',
                      boxShadow: isCurrent ? 'inset 0 0 0 2px var(--primary)' : 'none',
                    }}
                  />
                )
              }),
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BitButton
            onClick={() => {
              if (done) setPos(0)
              setPlaying((p) => !p)
            }}
            font="normal"
            className="gap-2 font-mono text-xs uppercase tracking-wider"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? 'Pause' : done ? 'Rejouer' : 'Lancer le balayage'}
          </BitButton>
          <BitButton
            onClick={() => {
              setPlaying(false)
              setPos((p) => Math.min(p + 1, OUT * OUT))
            }}
            variant="secondary"
            font="normal"
            className="gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <StepForward className="h-4 w-4" /> Étape
          </BitButton>
          <BitButton
            onClick={() => {
              setPlaying(false)
              setPos(0)
            }}
            variant="secondary"
            font="normal"
            className="gap-2 font-mono text-xs uppercase tracking-wider"
          >
            <RotateCcw className="h-4 w-4" /> Réinitialiser
          </BitButton>
        </div>
        <div className="flex items-center gap-3">
          <BitProgress
            value={(Math.min(pos, OUT * OUT) / (OUT * OUT)) * 100}
            variant="retro"
            className="h-2 w-28"
          />
          <span className="font-mono text-xs text-muted-foreground">
            {Math.min(pos, OUT * OUT)} / {OUT * OUT} positions
          </span>
        </div>
      </div>
    </div>
  )
}
