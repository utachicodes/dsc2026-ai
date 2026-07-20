'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const INPUTS_Y = [40, 100, 160]

/**
 * Small self-playing diagram: input nodes assemble in from scattered
 * positions, the connecting lines draw themselves toward the neuron, then a
 * signal pulse loops down the axon to the output. Reuses the same
 * assemble-in motion language as the pixel hero.
 */
export function NeuronPulse({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={cn('rounded-xl border bg-card p-4', className)}>
      <svg viewBox="0 0 320 200" className="w-full" role="img" aria-label="Diagramme animé d'un neurone artificiel">
        {INPUTS_Y.map((y, i) => (
          <line
            key={`line-${i}`}
            x1={60}
            y1={y}
            x2={150}
            y2={100}
            stroke="var(--primary)"
            strokeWidth={2}
            strokeDasharray={110}
            style={{
              strokeDashoffset: mounted ? 0 : 110,
              transition: `stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1) ${0.25 + i * 0.15}s`,
            }}
          />
        ))}
        <line
          x1={150}
          y1={100}
          x2={260}
          y2={100}
          stroke="var(--primary)"
          strokeWidth={2.5}
          strokeDasharray={110}
          style={{
            strokeDashoffset: mounted ? 0 : 110,
            transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1) 0.75s',
          }}
        />

        {INPUTS_Y.map((y, i) => (
          <circle
            key={`node-${i}`}
            cx={60}
            cy={y}
            r={12}
            fill="var(--secondary)"
            stroke="var(--border)"
            strokeWidth={1.5}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.3) translateX(-30px)',
              transformOrigin: `60px ${y}px`,
              transition: `opacity 0.5s ease-out ${i * 0.15}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s`,
            }}
          />
        ))}

        <circle
          cx={150}
          cy={100}
          r={26}
          fill="var(--primary)"
          fillOpacity={0.12}
          stroke="var(--primary)"
          strokeWidth={2}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.4)',
            transformOrigin: '150px 100px',
            transition: 'opacity 0.5s ease-out 0.6s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.6s',
            animation: mounted ? 'pulse-node 2.2s ease-in-out 1.4s infinite' : 'none',
          }}
        />
        <text x={150} y={104} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="var(--primary)">
          Σ + f
        </text>

        <circle
          cx={260}
          cy={100}
          r={12}
          fill="var(--secondary)"
          stroke="var(--border)"
          strokeWidth={1.5}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.3) translateX(30px)',
            transformOrigin: '260px 100px',
            transition: 'opacity 0.5s ease-out 0.95s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.95s',
          }}
        />
      </svg>
    </div>
  )
}
