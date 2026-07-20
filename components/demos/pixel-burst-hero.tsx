'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Pixel = { r: number; g: number; b: number }

const RES = 22

/**
 * Small autoplaying hero visual: the source photo starts scattered into its
 * pixels and assembles itself into place on mount, then drifts apart again
 * on hover. Sets up the "an image is just a grid of numbers" idea before the
 * slide even finishes reading.
 */
export function PixelBurstHero({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [pixels, setPixels] = useState<Pixel[]>([])
  const [assembled, setAssembled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const offsets = useMemo(() => {
    const total = RES * RES
    const arr: { x: number; y: number; rot: number }[] = []
    for (let i = 0; i < total; i++) {
      const seed = (i * 2654435761) % 2147483647
      const rx = ((seed % 1000) / 1000 - 0.5) * 2
      const ry = (((seed >> 3) % 1000) / 1000 - 0.5) * 2
      const rr = (((seed >> 6) % 1000) / 1000 - 0.5) * 2
      arr.push({ x: rx * 140, y: ry * 140, rot: rr * 40 })
    }
    return arr
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/pixel-source.png'
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = RES
      canvas.height = RES
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.clearRect(0, 0, RES, RES)
      ctx.drawImage(img, 0, 0, RES, RES)
      const data = ctx.getImageData(0, 0, RES, RES).data
      const next: Pixel[] = []
      for (let i = 0; i < data.length; i += 4) {
        next.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
      }
      setPixels(next)
      const t = setTimeout(() => setAssembled(true), 250)
      return () => clearTimeout(t)
    }
  }, [])

  const burst = hovering || !assembled

  return (
    <div
      className={cn('relative mx-auto aspect-square w-full max-w-[280px]', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="img"
      aria-label="Une photo qui se disperse en pixels colorés puis se reforme"
    >
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${RES}, 1fr)` }}>
        {pixels.map((p, i) => {
          const o = offsets[i]
          const delay = ((i * 37) % (RES * RES)) * 0.55
          return (
            <div
              key={i}
              className="aspect-square rounded-[1px] transition-transform ease-out"
              style={{
                backgroundColor: `rgb(${p.r}, ${p.g}, ${p.b})`,
                transitionDuration: '900ms',
                transitionDelay: `${delay}ms`,
                transform: burst ? `translate(${o.x}%, ${o.y}%) rotate(${o.rot}deg) scale(0.7)` : 'none',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
