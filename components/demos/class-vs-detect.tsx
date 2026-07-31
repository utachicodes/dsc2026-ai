'use client'

import { type ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { Kicker, Title } from '@/components/deck/primitives'
import { PredictReveal } from '@/components/deck/predict-reveal'

type Lang = 'fr' | 'en'

type Obj = { label: 'fruit' | 'bug'; cx: number; cy: number; r: number }

const OBJECTS: Obj[] = [
  { label: 'fruit', cx: 30, cy: 42, r: 15 },
  { label: 'fruit', cx: 70, cy: 36, r: 13 },
  { label: 'bug', cx: 52, cy: 74, r: 12 },
]

function FruitShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="17" r="12" fill="#fb923c" stroke="#c2410c" strokeWidth="1.5" />
      <ellipse cx="11" cy="13" rx="4.5" ry="3" fill="#ffedd5" opacity="0.55" />
      <path d="M16 7c1.5-2.6 3.6-3.2 5-2.2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="19.5" cy="3.8" rx="3.2" ry="1.8" fill="#4ade80" transform="rotate(18 19.5 3.8)" />
    </svg>
  )
}

function BugShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse cx="16" cy="20" rx="11" ry="8.5" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="10.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="11.5" cy="15.5" r="1.5" fill="#052e16" />
      <circle cx="21.5" cy="15.5" r="3" fill="#ffffff" />
      <circle cx="22.5" cy="15.5" r="1.5" fill="#052e16" />
      <path d="M13 23.5c1.8 1.6 4.2 1.6 6 0" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Scene({ showBoxes }: { showBoxes: boolean }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[150px] overflow-hidden rounded-lg border bg-secondary/40"
      role="img"
      aria-label={showBoxes ? 'The same frame with one bounding box per object' : 'The same camera frame'}
    >
      {OBJECTS.map((o, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${o.cx}%`,
            top: `${o.cy}%`,
            width: `${o.r * 2.4}%`,
            height: `${o.r * 2.4}%`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden
        >
          {o.label === 'fruit' ? <FruitShape className="h-full w-full" /> : <BugShape className="h-full w-full" />}
        </div>
      ))}
      {showBoxes
        ? OBJECTS.map((o, i) => (
            <div
              key={`box-${i}`}
              className="absolute rounded-sm border-2 border-dashed"
              style={{
                left: `${o.cx - o.r}%`,
                top: `${o.cy - o.r}%`,
                width: `${o.r * 2}%`,
                height: `${o.r * 2}%`,
                borderColor: o.label === 'fruit' ? '#fb923c' : '#4ade80',
              }}
              aria-hidden
            >
              <span
                className="absolute -top-2.5 left-0 rounded px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider text-white"
                style={{ backgroundColor: o.label === 'fruit' ? '#c2410c' : '#15803d' }}
              >
                {o.label}
              </span>
            </div>
          ))
        : null}
    </div>
  )
}

type DetOutput = { label: 'fruit' | 'bug'; text: string }

type Dict = {
  toggle: string
  title: string
  clsTitle: string
  clsSub: string
  detTitle: string
  detSub: string
  wholeChip: string
  clsOutput: string
  detOutputs: DetOutput[]
  question: string
  options: string[]
  explanation: ReactNode
  takeaway: string
}

const TXT: Record<Lang, Dict> = {
  en: {
    toggle: 'Section language',
    title: 'One label for a whole photo is a gamble',
    clsTitle: 'Image Classification',
    clsSub: '“What is it?”',
    detTitle: 'Object Detection',
    detSub: '“What? Where? How many?”',
    wholeChip: 'Whole photo',
    clsOutput: 'One answer for the entire image.',
    detOutputs: [
      { label: 'fruit', text: 'fruit ×2' },
      { label: 'bug', text: 'bug ×1' },
    ],
    question:
      'A photo contains two oranges and one frog — no dominant object. What does a single-label image classifier output?',
    options: [
      'One label for the photo',
      'Three labels',
      'Bounding boxes',
    ],
    explanation: (
      <p>
        A classifier bets on the single most probable category. With no dominant object it can guess something wrong —
        the MobileNet example answered “ashcan”. It has no way to answer “where” or “how many”.
      </p>
    ),
    takeaway: 'Detection = classification + a position for every object.',
  },
  fr: {
    toggle: 'Langue de la section',
    title: 'Une seule étiquette pour toute la photo, c’est un pari',
    clsTitle: 'Classification d’images',
    clsSub: '« Qu’est-ce que c’est ? »',
    detTitle: 'Détection d’objets',
    detSub: '« Quoi ? Où ? Combien ? »',
    wholeChip: 'Toute la photo',
    clsOutput: 'Une seule réponse pour l’image entière.',
    detOutputs: [
      { label: 'fruit', text: 'fruit ×2' },
      { label: 'bug', text: 'bug ×1' },
    ],
    question:
      'Une photo contient deux oranges et une grenouille — sans objet dominant. Que renvoie un classifieur d’images à une seule étiquette ?',
    options: [
      'Une seule étiquette pour la photo',
      'Trois étiquettes',
      'Des rectangles englobants',
    ],
    explanation: (
      <p>
        Un classifieur parie sur la seule catégorie la plus probable. Sans objet dominant, il peut se tromper —
        l’exemple MobileNet a répondu « ashcan ». Il n’a aucun moyen de dire « où » ni « combien ».
      </p>
    ),
    takeaway: 'La détection = la classification + une position pour chaque objet.',
  },
}

/**
 * Bilingual (EN/FR) lesson for the two core tasks. The same camera frame
 * (two oranges, one frog) is shown twice: a single-label classifier gives one
 * answer for the whole photo, while a detector draws a box per object and can
 * count. A predict-reveal challenge asks which output a classifier gives.
 */
export function ClassVsDetect() {
  const [lang, setLang] = useState<Lang>('en')
  const t = TXT[lang]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Kicker>Object Detection vs Image Classification</Kicker>
          <Title className="text-2xl md:text-3xl">{t.title}</Title>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-secondary p-1">
          {(['en', 'fr'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={l === lang}
              className={cn(
                'rounded-md px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors',
                l === lang
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {l === 'en' ? 'EN' : 'FR'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col rounded-xl border bg-card p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{t.clsTitle}</span>
            <span className="text-sm font-semibold text-foreground">{t.clsSub}</span>
          </div>
          <Scene showBoxes={false} />
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <span className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
              {t.wholeChip}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{t.clsOutput}</span>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-primary/40 bg-card p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{t.detTitle}</span>
            <span className="text-sm font-semibold text-foreground">{t.detSub}</span>
          </div>
          <Scene showBoxes />
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {t.detOutputs.map((o) => (
              <span
                key={o.text}
                className={cn(
                  'rounded-full border px-3 py-1 font-mono text-xs',
                  o.label === 'fruit'
                    ? 'border-[#fb923c]/50 bg-[#fb923c]/10 text-[#c2410c] dark:text-[#fb923c]'
                    : 'border-[#4ade80]/50 bg-[#4ade80]/10 text-[#15803d] dark:text-[#4ade80]',
                )}
              >
                {o.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <PredictReveal
        lang={lang}
        id="classifier-scene"
        question={t.question}
        options={t.options.map((label) => ({ label }))}
        correctIndex={0}
        explanation={<p>{t.explanation}</p>}
      />

      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3">
        <span className="font-mono text-lg text-primary">=</span>
        <p className="text-pretty text-sm font-medium text-foreground">{t.takeaway}</p>
      </div>
    </div>
  )
}
