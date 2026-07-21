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
          L&apos;IA d&apos;aujourd&apos;hui ne recrée que <Term>certaines</Term>{' '}de ces capacités, et elle ne pense pas
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
  {
    id: 'data-food',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 6 · Données',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le carburant du modèle</Kicker>
        <Title>Les données sont à l&apos;IA ce que la nourriture est pour vous</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <Card>
              <Flow direction="horizontal" steps={[{ label: 'Humain' }, { label: 'Nourriture' }, { label: 'Énergie', strong: true }]} />
            </Card>
            <Card>
              <Flow direction="horizontal" steps={[{ label: 'IA' }, { label: 'Données' }, { label: 'Connaissance', strong: true }]} />
            </Card>
          </div>
          <Callout label="Ordures en entrée, ordures en sortie">
            Si vous nourrissez un modèle avec des données désordonnées, biaisées ou mal étiquetées, vous obtenez un
            modèle désordonné, biaisé et faux. Aucun algorithme malin ne rattrape de mauvaises données. La qualité des
            données bat presque toujours l&apos;ingéniosité du modèle.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'structured-unstructured',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 7 · Types de données',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Deux formes de données</Kicker>
        <Title>Structurées ressemblent à un tableur. Non structurées, non.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Structurées">
            <CodeBlock>{`Nom    Âge  Taille
John   18   172
Sara   20   165`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">Des lignes et colonnes bien nettes, comme Excel.</p>
          </Card>
          <Card title="Non structurées" tone="positive">
            <div className="flex flex-wrap gap-2 font-mono text-sm text-muted-foreground">
              {['Images', 'Audio', 'Vidéo', 'Courriels', 'PDF'].map((t) => (
                <span key={t} className="rounded-md border border-border bg-secondary px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Les CNN se spécialisent dans les données d&apos;images non structurées, ce vers quoi on se dirige.</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'dataset',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 4 · Jeux de données',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La collection d&apos;exemples</Kicker>
        <Title>Un jeu de données est un ensemble de dossiers, un par classe</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CodeBlock>{`Pomme/    500 images
Orange/   500 images
Banane/   500 images`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">Chaque nom de dossier est une classe. Le modèle compare entre elles toutes.</p>
          </Card>
          <div className="grid gap-3">
            <Card title="Bon jeu de données" tone="positive">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {['Volumineux', 'Diversifié', 'Équilibré', 'Correctement étiqueté'].map((t) => (
                  <span key={t} className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary">
                    {t}
                  </span>
                ))}
              </div>
            </Card>
            <Card title="Mauvais jeu de données" tone="negative">
              <p className="text-sm text-muted-foreground">
                1000 chats mais seulement 20 chiens rend le modèle biaisé. Que des chats blancs le fait échouer sur les
                chats noirs. L&apos;équilibre et la variété comptent.
              </p>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'labels',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 5 · Étiquettes',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La vérité attachée à chaque exemple</Kicker>
        <Title>Sans étiquettes, l&apos;apprentissage supervisé est impossible</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CodeBlock>{`chien1.jpg  ->  Chien
chien2.jpg  ->  Chien
chat1.jpg   ->  Chat`}</CodeBlock>
          </Card>
          <Prose>
            L&apos;étiquette est la vérité terrain que le modèle utilise pour se vérifier. Une image mal étiquetée
            enseigne activement quelque chose de faux au modèle, donc un étiquetage soigné n&apos;est pas une corvée,
            c&apos;est le fondement.
          </Prose>
        </div>
      </div>
    ),
  },
  {
    id: 'classifier',
    chapter: 'Apprentissage & Données',
    kicker: 'Partie 3 · Classificateurs',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Un seul travail</Kicker>
        <Title>Un classificateur répond : quelle est cette catégorie ?</Title>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card>
            <Flow
              steps={[
                { label: 'Image caméra', hint: 'entrée' },
                { label: 'Classificateur' },
                { label: 'Classe + confiance', strong: true, hint: 'sortie' },
              ]}
            />
          </Card>
          <Card title="Exemple de sortie" tone="positive">
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-primary">Main ouverte</span>
                <span>97%</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Main fermée</span>
                <span>2%</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Inconnu</span>
                <span>1%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">La classe avec la plus haute probabilité l&apos;emporte.</p>
          </Card>
        </div>
      </div>
    ),
  },
  // ---------------------------------------------------------------- IMAGES
  {
    id: 'what-is-image',
    chapter: 'Images',
    kicker: 'Partie 6 · Images',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La grande révélation</Kicker>
        <Title>Un ordinateur ne voit jamais une image. Il voit des nombres.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Ce que vous voyez">
            <div className="grid w-40 grid-cols-3 gap-1">
              {[1, 1, 1, 0, 0, 1, 1, 0, 1].map((v, i) => (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{ backgroundColor: v ? 'var(--foreground)' : 'var(--secondary)' }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Une petite forme.</p>
          </Card>
          <Card title="Ce que l'ordinateur voit" tone="positive">
            <CodeBlock>{`255 255 255
  0   0 255
255   0 255`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">Ce ne sont que des nombres, du début à la fin.</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'pixels',
    chapter: 'Images',
    kicker: 'Partie 7 · Pixels',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Élément d&apos;image</Kicker>
        <Title>Chaque image est une grille de minuscules carrés colorés</Title>
        <Prose>Un pixel est le plus petit carré d&apos;une image. Une image, ce sont juste des millions d&apos;entre eux alignés en grille.</Prose>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat value="100 x 100" unit="px" label="10 000 pixels" />
          <Stat value="96 x 96" unit="px" label="9 216 pixels, courant en TinyML" />
          <Stat value="4000 x 3000" unit="px" label="12 millions de pixels, une photo de téléphone" />
        </div>
      </div>
    ),
  },
  {
    id: 'rgb',
    chapter: 'Images',
    kicker: 'Partie 8 · RVB',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Trois nombres par pixel</Kicker>
        <Title>Rouge, vert et bleu, chacun de 0 à 255</Title>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { n: 'Rouge', c: 'rgb(220,40,40)', v: '255, 0, 0' },
            { n: 'Vert', c: 'rgb(40,190,90)', v: '0, 255, 0' },
            { n: 'Bleu', c: 'rgb(60,110,230)', v: '0, 0, 255' },
            { n: 'Jaune', c: 'rgb(230,200,40)', v: '255, 255, 0' },
            { n: 'Blanc', c: 'rgb(245,245,245)', v: '255, 255, 255' },
            { n: 'Noir', c: 'rgb(20,20,24)', v: '0, 0, 0' },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border bg-card p-3">
              <div className="mb-2 aspect-square rounded-lg border" style={{ backgroundColor: s.c }} aria-hidden />
              <div className="text-sm font-medium text-foreground">{s.n}</div>
              <div className="font-mono text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
        <Callout>
          Mélanger trois canaux de 0 à 255 donne environ 16,7 millions de couleurs possibles par pixel. C&apos;est
          pourquoi la démo suivante peut reconstruire un perroquet en couleurs à partir de rien d&apos;autre que des
          triplets de nombres.
        </Callout>
      </div>
    ),
  },
  {
    id: 'pixel-demo',
    chapter: 'Images',
    kicker: 'Démo · Explorateur de pixels & RVB',
    content: (
      <div className="flex flex-col gap-6">
        <Kicker>Interactif</Kicker>
        <Title className="text-2xl md:text-4xl">Faites exploser l&apos;image et découvrez ce qu&apos;est vraiment un pixel</Title>
        <Prose>
          Appuyez sur <Mono>Exploser en pixels</Mono>, changez la résolution, puis survolez n&apos;importe quel
          carré. L&apos;image que vous reconnaissez se dissout dans les trois nombres avec lesquels la machine
          travaille réellement.
        </Prose>
        <PixelExplorer />
      </div>
    ),
  },
  {
    id: 'resolution',
    chapter: 'Images',
    kicker: 'Partie 9 · Résolution',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Combien de pixels</Kicker>
        <Title>Plus de résolution veut dire plus de détails, et plus de coût</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Stat value="32 x 32" label="1 024 pixels" />
            <Stat value="96 x 96" label="9 216 pixels" />
          </div>
          <Card title="Le compromis">
            <BulletList
              items={[
                <>Plus de détails aide la précision</>,
                <>Mais chaque pixel supplémentaire coûte de la mémoire et du calcul</>,
                <>Les microcontrôleurs ont très peu de RAM, donc le TinyML utilise souvent <Mono>96x96</Mono>{' '}ou{' '}<Mono>160x120</Mono></>,
              ]}
            />
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'matrices',
    chapter: 'Images',
    kicker: 'Partie 8 · Matrices',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Les images sont des maths</Kicker>
        <Title>Une image en niveaux de gris est une matrice. La couleur en fait trois.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Une matrice de luminosité">
            <CodeBlock>{`120 121 119 118 117
124 126 123 120 118
130 132 131 125 120`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">Chaque nombre est une valeur de luminosité.</p>
          </Card>
          <Card title="Couleur = trois matrices empilées" tone="positive">
            <div className="flex gap-3">
              {['R', 'V', 'B'].map((c, i) => (
                <div
                  key={c}
                  className="flex-1 rounded-lg border p-3 text-center font-mono text-sm"
                  style={{ color: `var(--rgb-${['red', 'green', 'blue'][i]})` }}
                >
                  matrice {c}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Empilez les matrices rouge, verte et bleue et vous obtenez une image en couleurs complète, purement
              faite de nombres.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'normalize',
    chapter: 'Images',
    kicker: 'Partie 9 · Prétraitement',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Préparer les nombres</Kicker>
        <Title>La normalisation ramène les pixels de 0-255 à 0-1</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow direction="horizontal" steps={[{ label: '128' }, { label: '128 / 255' }, { label: '0,502', strong: true }]} />
          </Card>
          <Prose>
            Les réseaux de neurones s&apos;entraînent plus stablement quand leurs entrées sont petites et cohérentes.
            Diviser chaque pixel par 255 garde les calculs bien maîtrisés et accélère l&apos;apprentissage.
          </Prose>
        </div>
      </div>
    ),
  },
  {
    id: 'augmentation',
    chapter: 'Images',
    kicker: 'Partie 10 · Augmentation',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Des données gratuites en plus</Kicker>
        <Title>Transformez 50 images en centaines en les modifiant</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Rotation">Une inclinaison de 15 degrés reste le même objet.</Card>
          <Card title="Miroir">Reflétez-le de gauche à droite.</Card>
          <Card title="Zoom">Mise à l&apos;échelle à 1,2x.</Card>
          <Card title="Luminosité">Rendez-le plus sombre ou plus clair.</Card>
        </div>
        <Callout>
          L&apos;augmentation apprend au modèle qu&apos;un objet reste ce même objet sous des angles et un éclairage
          différents. C&apos;est l&apos;une des façons les moins chères de rendre un petit jeu de données bien plus
          robuste.
        </Callout>
      </div>
    ),
  },
  {
    id: 'features',
    chapter: 'Images',
    kicker: 'Partie 10 · Caractéristiques',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Ce que le modèle recherche</Kicker>
        <Title>Les humains remarquent les yeux et les contours. Les réseaux apprennent les caractéristiques automatiquement.</Title>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {['Contours', 'Coins', 'Couleur', 'Forme', 'Texture'].map((t) => (
            <Card key={t}>{t}</Card>
          ))}
        </div>
        <Prose>
          Dans l&apos;ancienne vision par ordinateur, les ingénieurs concevaient ces caractéristiques à la main. La
          percée de l&apos;apprentissage profond, c&apos;est que le réseau découvre lui-même des caractéristiques
          utiles, directement à partir des pixels.
        </Prose>
      </div>
    ),
  },
  // ---------------------------------------------------------------- RÉSEAUX DE NEURONES
  {
    id: 'model',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 11 · Modèles',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Connaissance apprise</Kicker>
        <Title>Un modèle est un cerveau compressé, pas un album photo</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow steps={[{ label: 'Jeu de données' }, { label: 'Apprentissage' }, { label: 'Modèle', strong: true }, { label: 'Prédiction' }]} />
          </Card>
          <Callout label="Important">
            Le modèle ne stocke pas les images d&apos;entraînement. Il stocke des millions de nombres appris appelés{' '}
            <Term>poids</Term>{' '}qui capturent ce qu&apos;il en a appris. C&apos;est pourquoi un tout petit fichier peut
            reconnaître des choses qu&apos;il n&apos;a jamais vues.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'neuron',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 14 · Neurones',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le bloc de construction</Kicker>
        <Title>Un neurone artificiel multiplie, additionne, puis décide</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Inspiration biologique">
            <Flow direction="horizontal" steps={[{ label: 'Signaux' }, { label: 'Cellule cérébrale' }, { label: 'Sortie', strong: true }]} />
          </Card>
          <Card title="Neurone artificiel" tone="positive">
            <Flow
              steps={[
                { label: 'Nombres en entrée' },
                { label: 'Multiplier par les poids' },
                { label: 'Additionner + biais' },
                { label: 'Activation' },
                { label: 'Sortie', strong: true },
              ]}
            />
          </Card>
        </div>
        <NeuronPulse className="lg:max-w-md" />
        <Prose>Empilez des millions de ces neurones en couches et vous obtenez un réseau de neurones.</Prose>
      </div>
    ),
  },
  {
    id: 'weights-bias',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 12 & 13 · Poids et biais',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La mémoire du réseau</Kicker>
        <Title>L&apos;entraînement, c&apos;est juste ajuster les poids et les biais</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Poids">
            <p className="leading-relaxed text-muted-foreground">
              Chaque connexion a un nombre comme <Mono>0,2</Mono>, <Mono>-0,4</Mono>, ou <Mono>0,9</Mono>.
              L&apos;entraînement change ces nombres et rien d&apos;autre. Les modèles modernes en contiennent des
              millions ou des milliards.
            </p>
          </Card>
          <Card title="Biais" tone="positive">
            <CodeBlock>{`sortie = poids x entrée + biais`}</CodeBlock>
            <p className="mt-3 text-sm text-muted-foreground">
              Le biais est un réglage supplémentaire qui décale la frontière de décision, pour qu&apos;un neurone
              puisse s&apos;activer plus tôt ou plus tard.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'activation',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 14 · Fonctions d’activation',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Où vit la non-linéarité magique</Kicker>
        <Title>Sans fonctions d&apos;activation, l&apos;apprentissage profond s&apos;effondrerait</Title>
        <div className="grid gap-3 lg:grid-cols-3">
          <Card title="ReLU">
            Les négatifs deviennent 0, les positifs passent tels quels. Simple, rapide, et le choix par défaut dans les couches cachées.
          </Card>
          <Card title="Sigmoïde">
            Compresse n&apos;importe quel nombre dans l&apos;intervalle 0 à 1. Pratique pour les décisions oui ou non.
          </Card>
          <Card title="Softmax" tone="positive">
            Transforme les scores finaux en probabilités qui totalisent 100 %, pour pouvoir les lire comme des niveaux de confiance.
          </Card>
        </div>
        <Card title="Exemple de softmax">
          <div className="flex flex-wrap gap-4 font-mono text-sm">
            <span className="text-primary">Chat 0,82</span>
            <span className="text-muted-foreground">Chien 0,11</span>
            <span className="text-muted-foreground">Oiseau 0,07</span>
            <span className="text-muted-foreground">= 1,00</span>
          </div>
        </Card>
      </div>
    ),
  },
  {
    id: 'forward-prop',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 16 · Propagation avant',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Faire une prédiction</Kicker>
        <Title>Les données avancent à travers les couches</Title>
        <Card>
          <Flow
            direction="horizontal"
            steps={[
              { label: 'Image' },
              { label: 'Couche 1' },
              { label: 'Couche 2' },
              { label: 'Couche 3' },
              { label: 'Prédiction', strong: true },
            ]}
          />
        </Card>
        <Prose>
          Chaque couche transforme un peu plus les nombres, extrayant une information plus significative. Quand les
          nombres arrivent au bout, on a une prédiction. Ce trajet à sens unique s&apos;appelle la propagation avant.
        </Prose>
      </div>
    ),
  },
  {
    id: 'backprop',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 17 · Rétropropagation',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Apprendre de l&apos;erreur</Kicker>
        <Title>L&apos;erreur voyage vers l&apos;arrière, ajustant chaque poids</Title>
        <Card>
          <Flow
            direction="horizontal"
            steps={[
              { label: 'Prédiction vs vérité' },
              { label: 'Mesurer l’erreur' },
              { label: 'Renvoyer l’erreur en arrière' },
              { label: 'Ajuster chaque poids', strong: true },
            ]}
          />
        </Card>
        <Callout label="Le moteur de l&apos;apprentissage profond">
          La rétropropagation détermine combien chaque poids a contribué à l&apos;erreur et l&apos;ajuste dans la
          direction qui aurait réduit cette erreur. Répétez ceci des millions de fois et le réseau devient performant.
        </Callout>
      </div>
    ),
  },
  {
    id: 'gradient-descent',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 18 & 19 · Descente de gradient',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Marcher vers le bas</Kicker>
        <Title>Trouvez l&apos;erreur la plus basse en descendant toujours la pente</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow steps={[{ label: 'Perte élevée' }, { label: 'un pas en bas' }, { label: 'un pas en bas' }, { label: 'Minimum', strong: true }]} />
          </Card>
          <Card title="Le taux d'apprentissage contrôle la taille du pas" tone="positive">
            <BulletList
              items={[
                <>Pas trop <Term>petits</Term>{' '}: apprentissage douloureusement lent</>,
                <>Pas trop <Term>grands</Term>{' '}: on dépasse la cible et on rebondit</>,
                <>Juste ce qu&apos;il faut : convergence rapide et stable</>,
              ]}
            />
            <p className="mt-3 text-sm text-muted-foreground">Vous allez ressentir ça directement dans le simulateur d&apos;entraînement, bientôt.</p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'training-epochs',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 12 & 13 · Entraînement et époques',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Répétition</Kicker>
        <Title>L&apos;entraînement boucle sur le jeu de données de nombreuses fois</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="La boucle">
            <Flow steps={[{ label: 'Montrer l’image' }, { label: 'Prédire' }, { label: 'Comparer + ajuster' }, { label: 'Répéter', strong: true }]} />
          </Card>
          <Card title="Une époque" tone="positive">
            Une époque signifie que le modèle a vu tout le jeu de données une fois. Avec 1 000 images, l&apos;époque 1
            montre les 1 000, l&apos;époque 2 les montre à nouveau, et ainsi de suite pendant de nombreuses époques
            jusqu&apos;à ce que le modèle cesse de s&apos;améliorer.
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'loss-accuracy',
    chapter: 'Réseaux de neurones',
    kicker: 'Partie 20 & 21 · Perte et précision',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Deux nombres à surveiller</Kicker>
        <Title>La perte mesure à quel point on se trompe. La précision, à quelle fréquence on a raison.</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Perte">
            <p className="leading-relaxed text-muted-foreground">
              Un seul nombre mesurant à quel point les prédictions sont loin de la vérité. Une perte élevée signifie
              très faux, une perte basse signifie presque correct. L&apos;entraînement existe pour minimiser la perte.
            </p>
          </Card>
          <Card title="Précision" tone="positive">
            <p className="leading-relaxed text-muted-foreground">
              La part des prédictions correctes. 96 correctes sur 100 images donne <Mono>96%</Mono>{' '}de précision.
              Facile à lire, mais comme vous le verrez, ça peut cacher des problèmes.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  // ---------------------------------------------------------------- CNN
  {
    id: 'why-cnn',
    chapter: 'CNN',
    kicker: 'Partie 15 & 20 · Pourquoi les CNN',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le bon outil pour les images</Kicker>
        <Title>Les pixels voisins sont liés, et les CNN exploitent ça</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Un réseau classique sur une image 224x224" tone="negative">
            <Stat value="150 528" label="nombres connectés à chaque neurone" />
            <p className="mt-3 text-sm text-muted-foreground">Des millions de paramètres, lent, et ça ignore qu&apos;un pixel est lié à ses voisins.</p>
          </Card>
          <Card title="Un CNN" tone="positive">
            <p className="leading-relaxed text-muted-foreground">
              Réutilise de petits filtres qui glissent sur toute l&apos;image. Bien moins de paramètres, bien plus
              rapide, et ça respecte la structure 2D d&apos;une image. C&apos;est la norme pour la reconnaissance
              d&apos;images.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'cnn-buildup',
    chapter: 'CNN',
    kicker: 'Partie 16 · Hiérarchie',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Du simple au complexe</Kicker>
        <Title>Chaque couche se construit sur les motifs de la précédente</Title>
        <Card>
          <Flow
            direction="horizontal"
            steps={[
              { label: 'Contour' },
              { label: 'Coin' },
              { label: 'Cercle' },
              { label: 'Œil' },
              { label: 'Visage' },
              { label: 'Personne', strong: true },
            ]}
          />
        </Card>
        <Prose>
          Les premières couches détectent des contours et des lignes. Les couches intermédiaires les assemblent en
          yeux, roues et feuilles. Les couches profondes reconnaissent des objets entiers. Personne n&apos;a programmé
          cette hiérarchie ; elle émerge de l&apos;entraînement.
        </Prose>
      </div>
    ),
  },
  {
    id: 'convolution-demo',
    chapter: 'CNN',
    kicker: 'Démo · Convolution',
    content: (
      <div className="flex flex-col gap-6">
        <Kicker>Interactif · Partie 17</Kicker>
        <Title className="text-2xl md:text-4xl">Faites glisser un filtre 3x3 et regardez une carte de caractéristiques apparaître</Title>
        <Prose>
          Une convolution est une petite fenêtre qui se déplace sur l&apos;image. Chaque filtre chasse un motif
          précis. Appuyez sur <Mono>Lancer le balayage</Mono>{' '}et changez de filtre pour voir les contours
          s&apos;illuminer dans la carte de caractéristiques à droite.
        </Prose>
        <ConvolutionDemo />
      </div>
    ),
  },
  {
    id: 'pooling',
    chapter: 'CNN',
    kicker: 'Partie 18 · Pooling',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Réduire volontairement</Kicker>
        <Title>Le pooling réduit la taille tout en gardant l&apos;essentiel</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow direction="horizontal" steps={[{ label: '4 x 4' }, { label: 'pooling' }, { label: '2 x 2', strong: true }]} />
          </Card>
          <Card title="Pourquoi ça aide" tone="positive">
            <div className="flex flex-wrap gap-2 text-sm">
              {['Plus rapide', 'Moins de RAM', 'Moins de calcul', 'Moins de surapprentissage'].map((t) => (
                <span key={t} className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Crucial pour le TinyML, où chaque kilo-octet de mémoire compte.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'feature-maps',
    chapter: 'CNN',
    kicker: 'Partie 22 · Cartes de caractéristiques',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Beaucoup de nouvelles images</Kicker>
        <Title>Après la convolution, une image devient plusieurs cartes de caractéristiques</Title>
        <Prose>
          Chaque filtre produit sa propre image de sortie qui met en évidence une chose : l&apos;un trouve les
          contours verticaux, un autre les cercles, un autre la texture. Les CNN modernes génèrent des centaines ou
          des milliers de ces cartes de caractéristiques, empilant une information de plus en plus abstraite au fil
          des couches.
        </Prose>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Filtre A">contours verticaux</Card>
          <Card title="Filtre B">cercles</Card>
          <Card title="Filtre C">texture</Card>
          <Card title="...">des centaines d&apos;autres</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'cnn-layers',
    chapter: 'CNN',
    kicker: 'Partie 21 · Anatomie',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La pile complète</Kicker>
        <Title>Les couches d&apos;un CNN, du début à la fin</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Entrée">Reçoit les pixels.</Card>
          <Card title="Convolution">Détecte des motifs avec des filtres glissants.</Card>
          <Card title="Activation">Ajoute de la non-linéarité, généralement ReLU.</Card>
          <Card title="Pooling">Compresse, en gardant les caractéristiques clés.</Card>
          <Card title="Aplatissement">Transforme les cartes de caractéristiques en un long vecteur.</Card>
          <Card title="Dense + Sortie" tone="positive">Combine tout et produit des probabilités softmax.</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'output-layer',
    chapter: 'CNN',
    kicker: 'Partie 19 · Sortie',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>La réponse finale</Kicker>
        <Title>La couche de sortie donne une probabilité par classe</Title>
        <Card title="Classificateur de fruits" tone="positive">
          <div className="space-y-3">
            {[
              { c: 'Pomme', p: 95 },
              { c: 'Orange', p: 4 },
              { c: 'Banane', p: 1 },
            ].map((r) => (
              <div key={r.c} className="flex items-center gap-3">
                <span className={`w-20 font-mono text-sm ${r.p > 50 ? 'text-primary' : 'text-muted-foreground'}`}>{r.c}</span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${r.p > 50 ? 'bg-primary' : 'bg-muted-foreground/50'}`} style={{ width: `${r.p}%` }} />
                </div>
                <span className="w-12 text-right font-mono text-sm">{r.p}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Prose>La plus haute probabilité l&apos;emporte. Ce choix unique est la décision du classificateur.</Prose>
      </div>
    ),
  },
  // ---------------------------------------------------------------- BIEN ENTRAÎNER
  {
    id: 'splits',
    chapter: 'Bien entraîner',
    kicker: 'Partie 23 · Découpage des données',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Ne jamais étudier l&apos;examen</Kicker>
        <Title>Découpez vos données en entraînement, validation et test</Title>
        <div className="grid gap-3 lg:grid-cols-3">
          <Card title="Entraînement · 70-80%">Utilisé pour apprendre les poids.</Card>
          <Card title="Validation · 10-15%">Utilisé pour ajuster les réglages pendant l&apos;entraînement.</Card>
          <Card title="Test · 10-15%" tone="positive">Utilisé une seule fois, à la toute fin, pour mesurer la performance réelle.</Card>
        </div>
        <Callout>
          Le modèle ne doit jamais s&apos;entraîner sur l&apos;ensemble de test. Sinon, votre précision est un
          mensonge, comme un élève qui a vu les réponses de l&apos;examen à l&apos;avance.
        </Callout>
      </div>
    ),
  },
  {
    id: 'overfitting',
    chapter: 'Bien entraîner',
    kicker: 'Partie 22 · Surapprentissage',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>L&apos;échec classique</Kicker>
        <Title>Mémoriser n&apos;est pas la même chose qu&apos;apprendre</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Surapprentissage" tone="negative">
            Le modèle mémorise les images d&apos;entraînement et obtient un score parfait dessus, puis échoue sur tout
            ce qui est nouveau. Comme réussir les exercices d&apos;entraînement mais rater l&apos;examen réel.
          </Card>
          <Card title="Sous-apprentissage">
            L&apos;inverse. Le modèle est trop simple pour capturer le motif du tout, donc il se débrouille mal
            partout.
          </Card>
        </div>
        <Prose>Un bon entraînement trouve l&apos;équilibre entre ces deux extrêmes, et l&apos;ensemble de validation permet de trouver cet équilibre.</Prose>
      </div>
    ),
  },
  {
    id: 'transfer-learning',
    chapter: 'Bien entraîner',
    kicker: 'Partie 23 · Apprentissage par transfert',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Sur les épaules de géants</Kicker>
        <Title>Partez d&apos;un modèle qui sait déjà voir</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow
              steps={[
                { label: 'MobileNet, pré-entraîné sur des millions d’images' },
                { label: 'Garder ses compétences visuelles générales' },
                { label: 'Réentraîner seulement les dernières couches sur vos classes', strong: true },
              ]}
            />
          </Card>
          <Callout label="Pourquoi c&apos;est important pour le camp">
            Un modèle entraîné sur des millions d&apos;images comprend déjà les contours, les textures et les formes.
            Vous ne lui enseignez que vos quelques classes, ce qui demande bien moins de données et de temps. C&apos;est
            exactement comme ça que les plateformes TinyML comme Edge Impulse obtiennent de bons résultats avec les
            petits jeux de données qu&apos;on peut collecter en un après-midi.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'training-demo',
    chapter: 'Bien entraîner',
    kicker: 'Démo · Entraînement',
    content: (
      <div className="flex flex-col gap-6">
        <Kicker>Interactif · Parties 18-21</Kicker>
        <Title className="text-2xl md:text-4xl">Entraînez un modèle et regardez la perte descendre pendant que la précision monte</Title>
        <Prose>
          Choisissez un taux d&apos;apprentissage, puis appuyez sur <Mono>Entraîner le modèle</Mono>. Découvrez
          pourquoi trop petit rampe, trop grand rebondit, et juste bien s&apos;installe sur une précision haute et
          stable.
        </Prose>
        <TrainingSimulator />
      </div>
    ),
  },
  {
    id: 'confusion-demo',
    chapter: 'Bien entraîner',
    kicker: 'Démo · Matrice de confusion',
    content: (
      <div className="flex flex-col gap-6">
        <Kicker>Interactif · Partie 26</Kicker>
        <Title className="text-2xl md:text-4xl">La précision seule ment. La matrice de confusion dit la vérité.</Title>
        <Prose>
          Classez quelques images pierre, feuille, ciseaux, ou appuyez sur <Mono>Tout classer</Mono>. La diagonale
          verte représente les bonnes réponses ; chaque cellule rouge montre exactement quelles classes le modèle
          confond.
        </Prose>
        <ClassifierMatrix />
      </div>
    ),
  },
  // ---------------------------------------------------------------- TINYML & XIAO
  {
    id: 'inference-vs-training',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 24 · Deux phases',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Où chaque étape s&apos;exécute</Kicker>
        <Title>Entraînez sur un gros ordinateur, exécutez l&apos;inférence sur le petit</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Entraînement">
            <BulletList
              items={[
                <>Se déroule sur un ordinateur puissant ou dans le cloud</>,
                <>Utilise beaucoup de puissance CPU et GPU</>,
                <>Peut prendre des minutes à des jours</>,
                <>Modifie les poids du modèle</>,
              ]}
            />
          </Card>
          <Card title="Inférence" tone="positive">
            <BulletList
              items={[
                <>Se déroule après l&apos;entraînement</>,
                <>Utilise le modèle terminé pour faire des prédictions</>,
                <>Ne modifie pas le modèle</>,
                <>Fonctionne sur de tout petits appareils comme le XIAO</>,
              ]}
            />
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'why-tinyml',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 26 · Pourquoi le TinyML',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>L&apos;IA sans le cloud</Kicker>
        <Title>Une vraie intelligence sur une carte qui sirote à peine la batterie</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Faible latence">Des décisions en une fraction de seconde, sur l&apos;appareil.</Card>
          <Card title="Fonctionne hors ligne">Aucun internet nécessaire.</Card>
          <Card title="Privé">L&apos;image ne quitte jamais la carte.</Card>
          <Card title="Faible consommation" tone="positive">Fonctionne sur une petite batterie.</Card>
        </div>
        <Prose>
          Un XIAO n&apos;a qu&apos;une infime fraction de la mémoire et de la puissance de calcul d&apos;un
          ordinateur portable, et pourtant il peut faire tourner des modèles compacts. Le TinyML est l&apos;art de
          rendre les modèles assez petits, assez rapides et assez efficaces pour tenir dedans.
        </Prose>
      </div>
    ),
  },
  {
    id: 'quantization',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 25 · Quantification',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Le faire tenir</Kicker>
        <Title>Échangez des décimaux 32 bits contre des entiers 8 bits</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <Flow direction="horizontal" steps={[{ label: 'flottant 32 bits' }, { label: 'quantification' }, { label: 'entier 8 bits', strong: true }]} />
          </Card>
          <Card title="Résultat" tone="positive">
            <div className="flex flex-wrap gap-2 text-sm">
              {['Modèle plus petit', 'Inférence plus rapide', 'Consommation plus faible'].map((t) => (
                <span key={t} className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Le compromis est une petite baisse de précision, généralement négligeable pour les tâches que gère un XIAO.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'edge-impulse',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 24 & 27 · Flux de travail',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Jour 6 · Edge Impulse</Kicker>
        <Title>Le flux de travail, des photos jusqu&apos;à un modèle déployable</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'Créer un projet',
            'Connecter le XIAO, un téléphone, ou une webcam',
            'Collecter des images par classe',
            'Étiqueter chaque image',
            'Découper en entraînement et test',
            'Construire un impulse de classification d’images',
            'Générer les caractéristiques d’image',
            'Entraîner le réseau de neurones',
            'Vérifier la précision et la matrice de confusion',
            'Déployer le modèle',
          ].map((t, i) => (
            <Card key={t} title={`Étape ${i + 1}`}>
              {t}
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'deployment-runtime',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 27 · Sur l’appareil',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Ce qui se passe quand vous appuyez sur déployer</Kicker>
        <Title>Le modèle devient du C++ qui tourne sur la carte</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Au moment de la compilation">
            <BulletList
              items={[
                <>Modèle converti en TensorFlow Lite for Microcontrollers</>,
                <>Optimisé, souvent quantifié en 8 bits</>,
                <>Fichiers source C et C++ générés</>,
                <>Compilé avec votre sketch Arduino et téléversé</>,
              ]}
            />
          </Card>
          <Card title="À l'exécution, chaque image" tone="positive">
            <Flow
              steps={[
                { label: 'La caméra capture une image' },
                { label: 'Redimensionner et normaliser' },
                { label: 'Inférence du CNN' },
                { label: 'Probabilités' },
                { label: 'LED / OLED / moteur / buzzer', strong: true },
              ]}
            />
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'challenges',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 28 · Retour à la réalité',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Pourquoi les projets d&apos;IA échouent</Kicker>
        <Title>Repérer les problèmes est aussi important qu&apos;entraîner</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Mauvais éclairage">Des images prises en pleine lumière échouent en faible lumière.</Card>
          <Card title="Déséquilibre des classes">Une classe a bien plus d&apos;exemples qu&apos;une autre.</Card>
          <Card title="Surapprentissage">A mémorisé les données d&apos;entraînement plutôt que le motif.</Card>
          <Card title="Sous-apprentissage">Modèle trop simple pour capturer le motif.</Card>
          <Card title="Dérive des données">Le monde réel change avec le temps.</Card>
          <Card title="Biais d’arrière-plan" tone="negative">Chaque photo de chat était sur le même canapé, alors il a appris le canapé.</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'rps-project',
    chapter: 'TinyML & XIAO',
    kicker: 'Réalisation · Démo en classe',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Tout le cycle de vie en un seul projet</Kicker>
        <Title>Pierre, feuille, ciseaux sur le XIAO</Title>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <BulletList
              items={[
                <>Collectez 100 à 200 images de chacun de pierre, feuille et ciseaux, sous des éclairages et arrière-plans variés</>,
                <>Entraînez le modèle dans Edge Impulse par apprentissage par transfert</>,
                <>Déployez sur le XIAO équipé d&apos;une caméra</>,
                <>La carte classe le geste en temps réel et allume une LED correspondante ou affiche la classe</>,
              ]}
            />
          </Card>
          <Callout label="Pourquoi ce projet">
            Il touche à chaque idée de ces deux jours : collecte de données, étiquetage, entraînement, évaluation, et
            inférence sur l&apos;appareil, dans quelque chose que les élèves peuvent construire et comprendre
            eux-mêmes.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'pipeline',
    chapter: 'TinyML & XIAO',
    kicker: 'Partie 27 · La boucle complète',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Tout, dans l&apos;ordre</Kicker>
        <Title>Le pipeline complet de l&apos;IA</Title>
        <div className="rounded-xl border bg-card p-5 md:p-6">
          <Flow
            direction="horizontal"
            steps={[
              { label: 'Collecter les données' },
              { label: 'Étiqueter' },
              { label: 'Construire le jeu de données' },
              { label: 'Prétraiter' },
              { label: 'Entraîner le CNN' },
              { label: 'Évaluer' },
              { label: 'Améliorer les données' },
              { label: 'Exporter le modèle' },
              { label: 'Déployer sur le XIAO' },
              { label: 'Exécuter sur l’appareil', strong: true },
            ]}
          />
        </div>
        <Prose>
          Remarquez que c&apos;est une boucle, pas une ligne. L&apos;évaluation vous renvoie à améliorer les données,
          et de meilleures données sont presque toujours le chemin le plus rapide vers un meilleur modèle.
        </Prose>
      </div>
    ),
  },
  {
    id: 'close',
    chapter: 'TinyML & XIAO',
    kicker: 'Pour conclure',
    content: (
      <div className="flex flex-col gap-8">
        <Kicker>Vous pouvez maintenant expliquer</Kicker>
        <Title>D&apos;un seul pixel à un modèle sur le XIAO</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Récap jour 5">
            Comment les images deviennent des nombres, comment les classificateurs apprennent à partir de jeux de
            données étiquetés, et ce qu&apos;est vraiment un premier modèle.
          </Card>
          <Card title="Récap jour 6">
            Comment les CNN s&apos;entraînent, pourquoi l&apos;apprentissage par transfert et la quantification
            comptent, et comment déployer sur le XIAO.
          </Card>
          <Card title="Ensuite" tone="positive">
            Ouvrez Edge Impulse, collectez vos données pierre, feuille, ciseaux, et mettez un classificateur
            fonctionnel sur la carte.
          </Card>
        </div>
        <Callout label="Une phrase à retenir">
          Un ordinateur ne voit jamais une image. Il voit des nombres, apprend quels motifs de nombres comptent, et
          avec le TinyML il peut faire cette vision propulsée par l&apos;apprentissage n&apos;importe où, même sur une
          carte de la taille d&apos;une pièce de monnaie.
        </Callout>
      </div>
    ),
  },
]
