import type { ReactNode } from 'react'
import {
  BulletList,
  Callout,
  Card,
  CodeBlock,
  Flow,
  Kicker,
  Lead,
  Mono,
  Prose,
  Stat,
  Term,
  Title,
} from './primitives'
import { PixelExplorer } from '@/components/demos/pixel-explorer'
import { ConvolutionDemo } from '@/components/demos/convolution-demo'
import { TrainingSimulator } from '@/components/demos/training-simulator'
import { ClassifierMatrix } from '@/components/demos/classifier-matrix'
import { PixelBurstHero } from '@/components/demos/pixel-burst-hero'
import { NeuronPulse } from '@/components/demos/neuron-pulse'
import { Badge as BitBadge } from '@/components/ui/8bit/badge'

export type Slide = {
  id: string
  chapter: string
  kicker: string
  content: ReactNode
}

export const CHAPTERS = [
  'Départ',
  "Qu'est-ce que l'IA",
  'Apprentissage & Données',
  'Images',
  'Réseaux de neurones',
  'CNN',
  'Bien entraîner',
  'TinyML & XIAO',
] as const

export const slides: Slide[] = [
  // ---------------------------------------------------------------- DÉPART
  {
    id: 'cover',
    chapter: 'Départ',
    kicker: 'DAUST Summer Camp 2026 · AI Robot Mission',
    content: (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <BitBadge font="normal" className="mx-1.5 text-[10px] tracking-wider">
            AI ROBOT MISSION
          </BitBadge>
          <Kicker>Seeed Studio XIAO · TinyML</Kicker>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Voir comme une machine
            </h1>
            <Lead>
              Comment un ordinateur transforme une photo en nombres, apprend ce que ces nombres signifient, puis fait
              tourner cette intelligence sur une carte de la taille d&apos;une pièce de monnaie. On part d&apos;un
              seul pixel et on termine avec un classificateur d&apos;images qui fonctionne sur le XIAO.
            </Lead>
          </div>
          <PixelBurstHero />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card title="Jour 5">Comment les classificateurs apprennent, les jeux de données, et votre premier modèle.</Card>
          <Card title="Jour 6">Entraînez un modèle sur mesure et déployez-le sur le XIAO.</Card>
          <Card title="Quatre démos en direct" tone="positive">
            Pixels, convolution, entraînement, et une matrice de confusion à explorer.
          </Card>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          Utilisez les flèches du clavier, ou les boutons ci-dessous. Les diapositives longues défilent.
        </p>
      </div>
    ),
  },
]
