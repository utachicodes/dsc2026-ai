'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'

type Pixel = { r: number; g: number; b: number }

const RES_OPTIONS = [16, 28, 40]

export function PixelExplorer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [res, setRes] = useState(28)
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [burst, setBurst] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  // Deterministic scatter offsets per cell so the burst looks organic but stable.
  const offsets = useMemo(() => {
    const total = res * res
    const arr: { x: number; y: number; rot: number }[] = []
    for (let i = 0; i < total; i++) {
      const seed = (i * 2654435761) % 2147483647
      const rx = ((seed % 1000) / 1000 - 0.5) * 2
      const ry = (((seed >> 3) % 1000) / 1000 - 0.5) * 2
      const rr = (((seed >> 6) % 1000) / 1000 - 0.5) * 2
      arr.push({ x: rx * 10, y: ry * 10, rot: rr * 18 })
    }
    return arr
  }, [res])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/pixel-source.png'
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = res
      canvas.height = res
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.clearRect(0, 0, res, res)
      ctx.drawImage(img, 0, 0, res, res)
      const data = ctx.getImageData(0, 0, res, res).data
      const next: Pixel[] = []
      for (let i = 0; i < data.length; i += 4) {
        next.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
      }
      setPixels(next)
      setReady(true)
      setSelected(null)
    }
  }, [res])

  // Auto-play the burst once on first load, so the effect shows itself
  // before anyone has to find the button.
  useEffect(() => {
    if (!ready) return
    setBurst(true)
    const t = setTimeout(() => setBurst(false), 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const active = hovered ?? selected
  const activePixel = active != null ? pixels[active] : null
  const activeRow = active != null ? Math.floor(active / res) : null
  const activeCol = active != null ? active % res : null

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="rounded-xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-lg border bg-secondary p-1">
            {RES_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRes(r)}
                className={cn(
                  'rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
                  res === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r}x{r}
              </button>
            ))}
          </div>
          <BitButton
            onClick={() => setBurst((b) => !b)}
            font="normal"
            className="font-mono text-xs uppercase tracking-wider"
          >
            {burst ? 'Reformer l’image' : 'Exploser en pixels'}
          </BitButton>
        </div>

        <canvas ref={canvasRef} className="hidden" aria-hidden />

        <div
          className={cn(
            'relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-lg transition-[background-color,padding] duration-500',
            burst ? 'bg-background p-2' : 'bg-background p-0',
          )}
          role="group"
          aria-label="Grille de pixels interactive. Survolez ou sélectionnez un pixel pour lire ses valeurs RVB."
        >
          <div
            className="grid h-full w-full transition-[gap] duration-500 ease-out"
            style={{
              gridTemplateColumns: `repeat(${res}, 1fr)`,
              gap: burst ? '2px' : '0px',
            }}
          >
            {pixels.map((p, i) => {
              const o = offsets[i]
              const isActive = active === i
              return (
                <button
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected(i)}
                  aria-label={`Pixel colonne ${(i % res) + 1}, ligne ${Math.floor(i / res) + 1}. Rouge ${p.r}, vert ${p.g}, bleu ${p.b}.`}
                  className={cn(
                    'relative aspect-square outline-none transition-transform duration-500 ease-out',
                    burst ? 'rounded-[2px]' : 'rounded-none',
                  )}
                  style={{
                    backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})`,
                    transform: burst
                      ? `translate(${o.x}%, ${o.y}%) rotate(${o.rot}deg) scale(0.86)`
                      : 'none',
                    boxShadow: isActive ? '0 0 0 2px var(--foreground), 0 0 0 4px var(--background)' : 'none',
                    zIndex: isActive ? 5 : 1,
                  }}
                />
              )
            })}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          {ready ? `${res * res} pixels` : 'chargement...'} · survolez pour inspecter · cliquez pour figer un pixel
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Pixel sélectionné
          </div>
          {activePixel ? (
            <>
              <div className="flex items-center gap-4">
                <div
                  className="h-20 w-20 shrink-0 rounded-lg border"
                  style={{ backgroundColor: `rgb(${activePixel.r}, ${activePixel.g}, ${activePixel.b})` }}
                  aria-hidden
                />
                <div className="font-mono text-sm text-muted-foreground">
                  <div>
                    col <span className="text-foreground">{(activeCol ?? 0) + 1}</span>, ligne{' '}
                    <span className="text-foreground">{(activeRow ?? 0) + 1}</span>
                  </div>
                  <div className="mt-1 text-lg text-foreground">
                    rgb({activePixel.r}, {activePixel.g}, {activePixel.b})
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ChannelBar name="R" value={activePixel.r} varName="--rgb-red" />
                <ChannelBar name="G" value={activePixel.g} varName="--rgb-green" />
                <ChannelBar name="B" value={activePixel.b} varName="--rgb-blue" />
              </div>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pointez n&apos;importe quel carré de la grille. Pour la machine, ce carré n&apos;est rien de plus que
              trois nombres entre 0 et 255.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">L&apos;idée clé</div>
          <p className="text-pretty text-sm leading-relaxed text-foreground">
            L&apos;image que vous reconnaissez est une illusion construite à partir d&apos;une grille de carrés
            colorés. Un ordinateur ne voit jamais le perroquet. Il voit une longue liste de nombres, trois par
            pixel, et doit apprendre quels motifs de nombres veulent dire « perroquet ».
          </p>
        </div>
      </div>
    </div>
  )
}

function ChannelBar({ name, value, varName }: { name: string; value: number; varName: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-4 font-mono text-sm font-semibold" style={{ color: `var(${varName})` }}>
        {name}
      </span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${(value / 255) * 100}%`, backgroundColor: `var(${varName})` }}
        />
      </div>
      <span className="w-9 text-right font-mono text-sm text-foreground">{value}</span>
    </div>
  )
}
