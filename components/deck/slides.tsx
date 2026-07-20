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
]
