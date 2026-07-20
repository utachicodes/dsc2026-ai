'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowRight } from 'lucide-react'

/** Fires once when the element scrolls into view. Powers the reveal-as-you-go feel on tall slides. */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, visible }
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">
      <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
      {children}
    </div>
  )
}

export function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-balance text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl', className)}>
      {children}
    </h2>
  )
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl', className)}>
      {children}
    </p>
  )
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg', className)}>
      {children}
    </p>
  )
}

export function Term({ children }: { children: ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-mono text-primary', className)}>{children}</span>
}

export function Card({
  children,
  className,
  title,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  title?: ReactNode
  tone?: 'default' | 'positive' | 'negative'
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-card p-5 transition-all duration-500 ease-out md:p-6',
        'hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        tone === 'positive' && 'border-primary/40',
        tone === 'negative' && 'border-destructive/40',
        className,
      )}
    >
      {title ? (
        <div
          className={cn(
            'mb-3 font-mono text-xs uppercase tracking-[0.18em]',
            tone === 'default' && 'text-muted-foreground',
            tone === 'positive' && 'text-primary',
            tone === 'negative' && 'text-destructive',
          )}
        >
          {title}
        </div>
      ) : null}
      {children}
    </div>
  )
}

/**
 * A pipeline of steps connected by arrows. Steps assemble in with a
 * stagger, then the whole flow can be "played": hover or click a step to
 * walk the sequence, each arrow lighting up as the signal passes through.
 */
export function Flow({
  steps,
  className,
  direction = 'vertical',
}: {
  steps: { label: string; hint?: string; strong?: boolean }[]
  className?: string
  direction?: 'vertical' | 'horizontal'
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(-1)
  const [autoplaying, setAutoplaying] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoplaying) return
    let i = -1
    timer.current = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        setAutoplaying(false)
        setActive(-1)
        if (timer.current) clearInterval(timer.current)
        return
      }
      setActive(i)
    }, 420)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [autoplaying, steps.length])

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label="Rejouer le parcours des étapes"
      onMouseEnter={() => setAutoplaying(true)}
      onFocus={() => setAutoplaying(true)}
      onClick={() => setAutoplaying(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setAutoplaying(true)
        }
      }}
      className={cn(
        'flex cursor-pointer outline-none',
        direction === 'vertical' ? 'flex-col items-stretch gap-0' : 'flex-wrap items-center gap-0',
        className,
      )}
    >
      {steps.map((step, i) => {
        const lit = active === i
        return (
          <div
            key={i}
            className={cn('flex', direction === 'vertical' ? 'flex-col items-center' : 'flex-row items-center')}
            style={{
              transitionDelay: visible ? `${i * 90}ms` : '0ms',
            }}
          >
            <div
              className={cn(
                'rounded-lg border px-4 py-2.5 text-center font-mono text-sm transition-all duration-500 ease-out',
                visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0',
                step.strong
                  ? 'border-primary/50 bg-primary/10 text-foreground'
                  : 'border-border bg-secondary text-foreground',
                lit && 'border-primary bg-primary/20 shadow-[0_0_0_3px_var(--primary)] shadow-primary/20',
              )}
              style={{ transitionDelay: visible ? `${i * 90}ms` : '0ms' }}
            >
              <div>{step.label}</div>
              {step.hint ? <div className="mt-0.5 text-xs text-muted-foreground">{step.hint}</div> : null}
            </div>
            {i < steps.length - 1 ? (
              direction === 'vertical' ? (
                <ArrowDown
                  className={cn('my-1.5 h-4 w-4 transition-colors duration-300', lit ? 'text-primary' : 'text-primary/60')}
                  aria-hidden
                />
              ) : (
                <ArrowRight
                  className={cn('mx-2 h-4 w-4 transition-colors duration-300', lit ? 'text-primary' : 'text-primary/60')}
                  aria-hidden
                />
              )
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function Stat({ value, label, unit }: { value: string; label: string; unit?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-card p-5 transition-all duration-500 ease-out',
        visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
      )}
    >
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-3xl font-bold text-primary md:text-4xl">{value}</span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export function Callout({ children, label = 'Note' }: { children: ReactNode; label?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-primary/40 bg-primary/5 p-5 transition-all duration-500 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
      )}
    >
      <div className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">{label}</div>
      <p className="text-pretty leading-relaxed text-foreground">{children}</p>
    </div>
  )
}

export function BulletList({ items }: { items: ReactNode[] }) {
  const { ref, visible } = useReveal<HTMLUListElement>()
  return (
    <ul ref={ref} className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            'group flex gap-3 text-base leading-relaxed text-muted-foreground transition-all duration-500 ease-out md:text-lg',
            visible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
          )}
          style={{ transitionDelay: visible ? `${i * 80}ms` : '0ms' }}
        >
          <span
            className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150"
            aria-hidden
          />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-xl border bg-secondary/60 p-4 font-mono text-sm leading-relaxed text-foreground',
        className,
      )}
    >
      {children}
    </pre>
  )
}
