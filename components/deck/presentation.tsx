'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button as BitButton } from '@/components/ui/8bit/button'
import { Badge as BitBadge } from '@/components/ui/8bit/badge'
import { CHAPTERS, slides } from './slides'
import { QuizProvider, useQuiz } from './quiz-context'

export function Presentation() {
  return (
    <QuizProvider>
      <DeckView />
    </QuizProvider>
  )
}

function DeckView() {
  const { correct: quizCorrect, total: quizTotal } = useQuiz()
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const total = slides.length

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        const clamped = Math.max(0, Math.min(total - 1, next))
        return clamped === cur ? cur : clamped
      })
    },
    [total],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  // Reset scroll to top on each slide change.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      } else if (e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(total - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, go, total])

  const slide = slides[index]
  const activeChapter = slide.chapter

  // First slide index for each chapter, for the rail buttons.
  const chapterStarts = useMemo(() => {
    const map = new Map<string, number>()
    slides.forEach((s, i) => {
      if (!map.has(s.chapter)) map.set(s.chapter, i)
    })
    return map
  }, [])

  const progress = (index / Math.max(1, total - 1)) * 100
  const chapterIndex = CHAPTERS.indexOf(activeChapter as (typeof CHAPTERS)[number])

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Journey trail: a path with one waypoint per chapter and a marker for "you are here" */}
      <div className="w-full shrink-0 border-b bg-secondary/30 px-4 py-3 md:px-8">
        <div className="relative mx-auto h-1.5 max-w-6xl">
          <div className="absolute inset-0 rounded-full bg-border" aria-hidden />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary/70 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
          {CHAPTERS.map((c, i) => {
            const start = chapterStarts.get(c) ?? 0
            const pos = (start / Math.max(1, total - 1)) * 100
            const passed = i <= chapterIndex
            return (
              <button
                key={c}
                onClick={() => go(start)}
                aria-label={`Aller au chapitre ${c}`}
                className="absolute top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${pos}%` }}
              >
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full border-2 transition-all duration-300',
                    passed ? 'border-primary bg-primary' : 'border-border bg-background',
                  )}
                />
              </button>
            )
          })}
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-primary transition-[left] duration-500 ease-out"
            style={{
              left: `${progress}%`,
              boxShadow: '0 0 0 4px var(--background), 0 0 0 5px var(--primary)',
              animation: 'bob 1.8s ease-in-out infinite',
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* Header: chapter rail */}
      <header className="shrink-0 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <nav aria-label="Chapitres" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1">
            {CHAPTERS.map((c, i) => {
              const start = chapterStarts.get(c)
              const isActive = c === activeChapter
              return (
                <button
                  key={c}
                  onClick={() => start != null && go(start)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  <span className="mr-1 opacity-60">{String(i).padStart(2, '0')}</span>
                  {c}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Slide body with scroll fallback */}
      <main ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-4 py-10 md:px-8 md:py-16">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>{slide.kicker}</span>
          </div>
          <div key={slide.id} className="slide-enter">
            {slide.content}
          </div>
        </div>
      </main>

      {/* Footer controls */}
      <footer className="shrink-0 border-t bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm text-muted-foreground">
              <span className="text-foreground">{String(index + 1).padStart(2, '0')}</span>
              <span className="mx-1 opacity-50">/</span>
              {String(total).padStart(2, '0')}
            </div>
            {quizTotal > 0 ? (
              <BitBadge font="normal" className="text-[10px] tracking-wider">
                <Trophy className="mr-1 h-3 w-3" /> {quizCorrect}/{quizTotal}
              </BitBadge>
            ) : null}
          </div>

          <div className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground sm:block">
            flèches du clavier pour naviguer
          </div>

          <div className="mr-2 flex items-center gap-2.5">
            <BitButton
              onClick={prev}
              disabled={index === 0}
              aria-label="Diapositive précédente"
              variant="secondary"
              font="normal"
              className="gap-1.5 font-mono text-xs uppercase tracking-wider"
            >
              <ChevronLeft className="h-4 w-4" /> Préc.
            </BitButton>
            <BitButton
              onClick={next}
              disabled={index === total - 1}
              aria-label="Diapositive suivante"
              font="normal"
              className="gap-1.5 font-mono text-xs uppercase tracking-wider"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </BitButton>
          </div>
        </div>
      </footer>
    </div>
  )
}
