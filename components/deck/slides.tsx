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
  {
    id: 'roadmap',
    chapter: 'Départ',
    kicker: 'Le trajet',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Où on va</Kicker>
        <Title>D&apos;un seul pixel à un modèle qui tourne sur un microcontrôleur</Title>
        <Prose>
          La plupart des tutoriels vous disent sur quels boutons cliquer. Celui-ci explique pourquoi chaque étape
          fonctionne, dans l&apos;ordre qui construit la compréhension plutôt que l&apos;ordre imposé par le logiciel.
        </Prose>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card title="1 · Qu'est-ce que l'IA">L&apos;intelligence, l&apos;apprentissage automatique, et pourquoi on laisse l&apos;ordinateur trouver les règles.</Card>
          <Card title="2 · Données">Jeux de données, étiquettes, classificateurs, et comment fonctionne l&apos;apprentissage supervisé.</Card>
          <Card title="3 · Images">Pixels, RVB, résolution, matrices, et caractéristiques.</Card>
          <Card title="4 · Réseaux">Neurones, poids, activation, passes avant et arrière.</Card>
          <Card title="5 · CNN">Convolution, pooling, cartes de caractéristiques, et couches.</Card>
          <Card title="6 · Entraînement">Découpages, surapprentissage, apprentissage par transfert, perte et précision.</Card>
          <Card title="7 · TinyML">Quantification, déploiement, et inférence sur le XIAO.</Card>
          <Card title="Réalisation" tone="positive">Un classificateur pierre-feuille-ciseaux, des données jusqu&apos;à l&apos;appareil.</Card>
        </div>
      </div>
    ),
  },
  // ---------------------------------------------------------------- QU'EST-CE QUE L'IA
  {
    id: 'intelligence',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 1 · Intelligence',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Avant les machines</Kicker>
        <Title>Qu&apos;est-ce qui rend quelque chose intelligent ?</Title>
        <Lead>Demandez d&apos;abord à la salle. L&apos;intelligence humaine est un ensemble de capacités, pas une seule chose.</Lead>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'On apprend par l’expérience',
            'On reconnaît des motifs',
            'On se souvient des choses',
            'On résout des problèmes',
            'On s’adapte à de nouvelles situations',
            'On décide avec des informations incomplètes',
          ].map((t) => (
            <Card key={t}>{t}</Card>
          ))}
        </div>
        <Callout label="Cadrage honnête">
          L&apos;IA d&apos;aujourd&apos;hui ne recrée que <Term>certaines</Term> de ces capacités, et elle ne pense pas
          comme vous. Elle trouve des motifs mathématiques dans d&apos;énormes quantités de données. C&apos;est
          puissant, et c&apos;est aussi sa principale limite.
        </Callout>
      </div>
    ),
  },
]
