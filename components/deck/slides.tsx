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
  {
    id: 'what-is-ai',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 1 · Définition',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Intelligence artificielle</Kicker>
        <Title>Faire faire à des ordinateurs des choses qui demandent normalement l&apos;intelligence humaine</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'Reconnaître des visages',
            'Comprendre la parole',
            'Traduire des langues',
            'Conduire une voiture',
            'Détecter des maladies',
            'Identifier des objets dans une caméra',
          ].map((t) => (
            <Card key={t}>{t}</Card>
          ))}
        </div>
        <Prose>
          Remarquez que ce sont toutes des tâches où écrire chaque règle à la main est sans espoir. Cette difficulté
          est la raison même de l&apos;existence du domaine.
        </Prose>
      </div>
    ),
  },
  {
    id: 'traditional-vs-ai',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 1 · Deux philosophies',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le basculement clé</Kicker>
        <Title>La programmation traditionnelle écrit les règles. L&apos;IA les découvre.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Programmation traditionnelle">
            <Flow
              steps={[
                { label: 'Règles + Données' },
                { label: 'Programme' },
                { label: 'Réponse', strong: true },
              ]}
            />
            <CodeBlock className="mt-4">{`SI l'objet a 4 pattes
ET dit "miaou"
ALORS chat`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">Vous écrivez chaque règle à la main. Ça casse à la première exception.</p>
          </Card>
          <Card title="Apprentissage automatique" tone="positive">
            <Flow
              steps={[
                { label: 'Données + Réponses' },
                { label: 'Apprentissage' },
                { label: 'Modèle', strong: true },
              ]}
            />
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Au lieu de lui dire « les chats ont des moustaches », vous lui montrez des milliers de photos de chats
              et vous le laissez déterminer ce qui fait qu&apos;un chat est un chat.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'ai-ml-dl',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 2 · Vocabulaire',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Trois mots que les élèves confondent</Kicker>
        <Title>L&apos;IA contient l&apos;apprentissage automatique, qui contient l&apos;apprentissage profond</Title>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border bg-card p-6">
            <div className="rounded-xl border border-border p-5">
              <div className="font-mono text-sm text-foreground">Intelligence artificielle</div>
              <div className="mt-4 rounded-xl border border-muted-foreground/30 p-5">
                <div className="font-mono text-sm text-foreground">Apprentissage automatique</div>
                <div className="mt-4 rounded-xl border border-primary/50 bg-primary/5 p-5">
                  <div className="font-mono text-sm text-primary">Apprentissage profond</div>
                  <p className="mt-1 text-xs text-muted-foreground">Les CNN vivent ici</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Card title="Intelligence artificielle">
              Toute machine se comportant intelligemment : un moteur d&apos;échecs, une voiture autonome, un assistant vocal.
            </Card>
            <Card title="Apprentissage automatique">
              Un sous-ensemble de l&apos;IA. Au lieu de programmer des règles, la machine les apprend à partir d&apos;exemples.
            </Card>
            <Card title="Apprentissage profond" tone="positive">
              Un sous-ensemble du ML utilisant de grands réseaux de neurones. Idéal pour les images, la parole, le texte et la vidéo.
            </Card>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'what-is-ml',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 2 · Apprentissage automatique',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Apprendre comme un enfant</Kicker>
        <Title>On n&apos;explique pas un chien. On en montre plein.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {['Chien', 'Chien', 'Chien', 'Chien', 'Chat', 'Chat', 'Chat'].map((t, i) => (
                <span
                  key={i}
                  className={`rounded-md border px-3 py-1.5 ${t === 'Chien' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Finalement, l&apos;enfant reconnaît des chiens qu&apos;il n&apos;a jamais vus. Il a généralisé à partir d&apos;exemples.
            </p>
          </Card>
          <Callout label="La définition qui reste">
            L&apos;apprentissage automatique consiste à trouver des motifs dans des exemples pour pouvoir faire de
            bonnes suppositions sur de nouveaux exemples jamais vus. Cette dernière partie, la généralisation, c&apos;est
            tout l&apos;enjeu.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'why-ml',
    chapter: "Qu'est-ce que l'IA",
    kicker: 'Partie 3 · Pourquoi s’embêter',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le piège de l&apos;écriture de règles</Kicker>
        <Title>Essayez de coder « chat » à la main et vous ne finirez jamais</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Vos règles">
            <CodeBlock>{`si oreilles == pointues
et moustaches == vrai
et queue == longue`}</CodeBlock>
          </Card>
          <Card title="La réalité" tone="negative">
            <div className="flex flex-wrap gap-2 font-mono text-sm text-muted-foreground">
              {['chats endormis', 'chats noirs', 'chats poilus', 'vue de côté', 'à l’envers', 'chat de dessin animé'].map((t) => (
                <span key={t} className="rounded-md border border-border bg-secondary px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">Trop de cas. Impossible à la main. Alors on laisse la machine apprendre à la place.</p>
          </Card>
        </div>
      </div>
    ),
  },
  // ---------------------------------------------------------------- APPRENTISSAGE & DONNÉES
  {
    id: 'supervised',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 4 · Apprentissage supervisé',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Comment Edge Impulse apprend</Kicker>
        <Title>Chaque exemple porte sa bonne réponse</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow
              direction="horizontal"
              steps={[{ label: 'Image' }, { label: 'Chien', strong: true }]}
            />
            <div className="mt-3">
              <Flow direction="horizontal" steps={[{ label: 'Image' }, { label: 'Chat', strong: true }]} />
            </div>
          </Card>
          <Card title="Le signal d'apprentissage" tone="positive">
            Le modèle fait une supposition, puis la compare à la vérité. La différence entre la prédiction et la
            vérité est l&apos;<Term>erreur</Term>, et réduire cette erreur, c&apos;est exactement ce que fait
            l&apos;entraînement.
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'learning-types',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 5 · Autres saveurs',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Tout n&apos;est pas un classificateur</Kicker>
        <Title>Trois façons pour une machine d&apos;apprendre</Title>
        <div className="grid gap-3 lg:grid-cols-3">
          <Card title="Supervisé">
            Les données viennent avec des étiquettes : chat, chien, voiture. Le modèle apprend la correspondance entre
            l&apos;entrée et la réponse connue. C&apos;est ce qu&apos;on utilise au camp.
          </Card>
          <Card title="Non supervisé">
            Pas d&apos;étiquettes. Videz mille pièces de LEGO sur une table et le modèle les regroupe par couleur et
            taille tout seul.
          </Card>
          <Card title="Par renforcement">
            Pas d&apos;étiquettes, juste des récompenses. Un bon coup rapporte des points, un mauvais en fait perdre.
            Utilisé pour les robots, les jeux et les drones.
          </Card>
        </div>
      </div>
    ),
  },
]
