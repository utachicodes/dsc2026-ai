'use client'

import { useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Progress as BitProgress } from '@/components/ui/8bit/progress'

const W = 560
const H = 400

type Label = 'fruit' | 'bug'

type Obj = {
  id: string
  label: Label
  box: { x: number; y: number; w: number; h: number }
}

const OBJECTS: Obj[] = [
  { id: 'f1', label: 'fruit', box: { x: 60, y: 70, w: 90, h: 92 } },
  { id: 'f2', label: 'fruit', box: { x: 230, y: 55, w: 100, h: 102 } },
  { id: 'f3', label: 'fruit', box: { x: 410, y: 265, w: 80, h: 82 } },
  { id: 'b1', label: 'bug', box: { x: 345, y: 175, w: 86, h: 82 } },
  { id: 'b2', label: 'bug', box: { x: 100, y: 260, w: 86, h: 82 } },
]

type Box = { x: number; y: number; w: number; h: number }

function iou(a: Box, b: Box) {
  const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
  const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
  const inter = ix * iy
  const union = a.w * a.h + b.w * b.h - inter
  return union > 0 ? inter / union : 0
}

function normalize(raw: Box): Box {
  return {
    x: Math.min(raw.x, raw.x + raw.w),
    y: Math.min(raw.y, raw.y + raw.h),
    w: Math.abs(raw.w),
    h: Math.abs(raw.h),
  }
}

const PALETTE: Record<Label, { fill: string; stroke: string; chip: string }> = {
  fruit: { fill: 'rgba(251,146,60,0.18)', stroke: '#fb923c', chip: 'bg-[#fb923c]' },
  bug: { fill: 'rgba(74,222,128,0.18)', stroke: '#4ade80', chip: 'bg-[#4ade80]' },
}

function FruitShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <svg x={cx - r} y={cy - r} width={r * 2} height={r * 2} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="17" r="12" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
      <ellipse cx="11" cy="13" rx="4.5" ry="3" fill="#ffedd5" opacity="0.55" />
      <path d="M16 7c1.5-2.6 3.6-3.2 5-2.2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="19.5" cy="3.8" rx="3.2" ry="1.8" fill="#4ade80" transform="rotate(18 19.5 3.8)" />
    </svg>
  )
}

function BugShape({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <svg x={cx - r} y={cy - r} width={r * 2} height={r * 2} viewBox="0 0 32 32" aria-hidden>
      <ellipse cx="16" cy="20" rx="11" ry="8.5" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="10.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="11.5" cy="15.5" r="1.5" fill="#052e16" />
      <circle cx="21.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="22.5" cy="15.5" r="1.5" fill="#052e16" />
      <path d="M13 23.5c1.8 1.6 4.2 1.6 6 0" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/**
 * A mini version of the Edge Impulse labeling queue. Campers pick a label
 * (fruit or bug), drag a box around an object, and the box is scored with
 * Intersection-over-Union against the ground-truth boxes — exactly what the
 * Studio does when you draw bounding boxes by hand.
 */
export function LabelingGame() {
  const [activeLabel, setActiveLabel] = useState<Label>('fruit')
  const [drag, setDrag] = useState<Box | null>(null)
  const [boxes, setBoxes] = useState<{ id: string; box: Box; label: Label; verdict: 'ok' | 'wrong' }[]>([])
  const [caught, setCaught] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const total = OBJECTS.length
  const done = caught.size
  const complete = done === total

  function point(e: React.PointerEvent) {
    const el = svgRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    }
  }

  function onDown(e: React.PointerEvent) {
    if (complete) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = point(e)
    setDrag({ x: p.x, y: p.y, w: 0, h: 0 })
    setMsg(null)
  }

  function onMove(e: React.PointerEvent) {
    if (!drag) return
    const p = point(e)
    setDrag((d) => (d ? { ...d, w: p.x - d.x, h: p.y - d.y } : d))
  }

  function onUp() {
    if (!drag) return
    const box = normalize(drag)
    setDrag(null)
    if (box.w < 10 || box.h < 10) {
      setMsg('That box is too tiny — drag a bigger one.')
      return
    }

    let bestObj: Obj | null = null
    let bestScore = 0
    for (const o of OBJECTS) {
      if (o.label !== activeLabel) continue
      const s = iou(box, o.box)
      if (s > bestScore) {
        bestScore = s
        bestObj = o
      }
    }

    let oppositeHit = false
    for (const o of OBJECTS) {
      if (o.label === activeLabel) continue
      if (iou(box, o.box) > 0.05) oppositeHit = true
    }

    if (bestObj && bestScore >= 0.3 && !oppositeHit) {
      setCaught((prev) => new Set(prev).add(bestObj!.id))
      setBoxes((prev) => [...prev, { id: `ok-${Date.now()}`, box, label: activeLabel, verdict: 'ok' }])
      setMsg(`Nice — one ${activeLabel} boxed and saved.`)
    } else if (oppositeHit) {
      setBoxes((prev) => [...prev, { id: `bad-${Date.now()}`, box, label: activeLabel, verdict: 'wrong' }])
      setMsg(activeLabel === 'fruit' ? 'That one is a bug, not a fruit! Redo the box.' : 'That one is a fruit, not a bug! Redo the box.')
    } else {
      setBoxes((prev) => [...prev, { id: `miss-${Date.now()}`, box, label: activeLabel, verdict: 'wrong' }])
      setMsg('That box missed the object — try again.')
    }
  }

  function reset() {
    setBoxes([])
    setCaught(new Set())
    setDrag(null)
    setMsg(null)
    setActiveLabel('fruit')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-xl border bg-card p-3 md:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Labeling queue · {done}/{total}</div>
          <div className="flex items-center gap-2">
            {(['fruit', 'bug'] as const).map((label) => (
              <button
                key={label}
                onClick={() => setActiveLabel(label)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
                  activeLabel === label
                    ? 'border-primary/60 bg-primary/10 text-foreground'
                    : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', PALETTE[label].chip)} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={cn(
            'mx-auto w-full max-w-[620px] max-h-[44vh] touch-none select-none rounded-lg border bg-secondary/40',
            complete ? 'cursor-default' : 'cursor-crosshair',
          )}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          role="img"
          aria-label="Scene with oranges and frogs to label by dragging boxes"
        >
          <rect width={W} height={H} fill="var(--secondary)" opacity={0.5} />
          {/* floor line to suggest a fixed camera */}
          <line x1={0} y1={H - 70} x2={W} y2={H - 70} stroke="var(--border)" strokeWidth={1} strokeDasharray="6 6" />

          {OBJECTS.map((o) => {
            const c = { x: o.box.x + o.box.w / 2, y: o.box.y + o.box.h / 2 }
            const r = Math.min(o.box.w, o.box.h) / 2
            const isCaught = caught.has(o.id)
            return (
              <g key={o.id}>
                {o.label === 'fruit' ? (
                  <FruitShape cx={c.x} cy={c.y} r={r * 0.82} />
                ) : (
                  <BugShape cx={c.x} cy={c.y} r={r * 0.82} />
                )}
                {isCaught ? (
                  <g>
                    <rect
                      x={o.box.x - 4}
                      y={o.box.y - 4}
                      width={o.box.w + 8}
                      height={o.box.h + 8}
                      rx={4}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                    />
                    <rect
                      x={o.box.x + o.box.w / 2 - 11}
                      y={o.box.y + o.box.h / 2 - 11}
                      width={22}
                      height={22}
                      rx={6}
                      fill="var(--primary)"
                    />
                    <path
                      d="m-3 0 2.5 2.5 5-5"
                      stroke="var(--primary-foreground)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform={`translate(${o.box.x + o.box.w / 2}, ${o.box.y + o.box.h / 2})`}
                      fill="none"
                    />
                  </g>
                ) : null}
              </g>
            )
          })}

          {boxes.map((b) => (
            <rect
              key={b.id}
              x={b.box.x}
              y={b.box.y}
              width={b.box.w}
              height={b.box.h}
              fill={PALETTE[b.label].fill}
              stroke={b.verdict === 'ok' ? PALETTE[b.label].stroke : 'var(--destructive)'}
              strokeWidth={b.verdict === 'ok' ? 2 : 2}
              strokeDasharray={b.verdict === 'ok' ? undefined : '5 4'}
            />
          ))}

          {drag && drag.w !== 0 && drag.h !== 0 ? (
            (() => {
              const box = normalize(drag)
              return (
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  fill={PALETTE[activeLabel].fill}
                  stroke={PALETTE[activeLabel].stroke}
                  strokeWidth={2}
                />
              )
            })()
          ) : null}
        </svg>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className={cn('text-sm', msg ? 'text-foreground' : 'text-muted-foreground')}>
            {complete ? 'All objects labeled — the queue is empty. Well done!' : msg ?? 'Pick a label, then drag a box around each object.'}
          </p>
          {complete ? (
            <BitButton onClick={reset} variant="secondary" font="normal" className="gap-2 font-mono text-xs uppercase tracking-wider">
              <RotateCcw className="h-3.5 w-3.5" /> New scene
            </BitButton>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Progress</div>
          <BitProgress value={(done / total) * 100} variant="retro" className="h-2.5 w-full" />
          <p className="mt-2 text-sm text-muted-foreground">
            {done}/{total} objects labeled. A box counts when it overlaps the object well enough — measured like the
            Studio does.
          </p>
        </div>
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
          <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">Why boxes here, not FOMO?</div>
          <p className="text-pretty text-sm leading-relaxed text-foreground">
            The dataset needs boxes so the model knows where each object is. But once trained, FOMO drops the box: at
            inference it only needs a centroid to count and locate. Big boxes cost big memory — centroids do not.
          </p>
        </div>
      </div>
    </div>
  )
}
