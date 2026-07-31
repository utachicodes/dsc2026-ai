import type { ReactNode } from 'react'
import Image from 'next/image'
import { BulletList, Callout, Card, Flow, Kicker, Lead, Prose, Stat, Term, Title } from './primitives'
import { PredictReveal } from './predict-reveal'
import { Badge as BitBadge } from '@/components/ui/8bit/badge'
import { PixelBurstHero } from '@/components/demos/pixel-burst-hero'
import { PixelExplorer } from '@/components/demos/pixel-explorer'
import { HistoryTimeline } from '@/components/demos/history-timeline'
import { NeuronLab } from '@/components/demos/neuron-lab'
import { TrainingSimulator } from '@/components/demos/training-simulator'
import { ConvolutionDemo } from '@/components/demos/convolution-demo'
import { GpuRace } from '@/components/demos/gpu-race'
import { TokenPredictor } from '@/components/demos/token-predictor'
import { FomoDetector } from '@/components/demos/fomo-detector'
import { tutorialSlides, TUTORIAL_CHAPTER } from './tutorial-slides'

export type Slide = {
  id: string
  chapter: string
  kicker: string
  minutes: number
  kind: 'concept' | 'interaction' | 'milestone'
  content: ReactNode
}

export const CHAPTERS = ['IA ?', 'Histoire', 'Apprendre', 'Réseaux', 'Déclic 2012', 'ChatGPT', 'Détection', 'Mission XIAO', TUTORIAL_CHAPTER] as const

function ArchiveImage({
  src,
  alt,
  caption,
  credit,
  className = '',
  position = 'center',
}: {
  src: string
  alt: string
  caption: string
  credit: string
  className?: string
  position?: string
}) {
  return (
    <figure className={`relative min-h-48 overflow-hidden rounded-xl border bg-secondary ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover grayscale-[15%]"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-4 pb-3 pt-12 text-white">
        <figcaption className="text-sm font-semibold">{caption}</figcaption>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-white/70">{credit}</p>
      </div>
    </figure>
  )
}

export const slides: Slide[] = [
  {
    id: 'cover', chapter: 'IA ?', kicker: 'DAUST Summer Camp 2026 · AI Robot Mission', minutes: 1, kind: 'milestone',
    content: (
      <div className="deck-slide">
        <Image src="/daust-logo.png" alt="DAUST" width={2200} height={337} className="h-7 w-auto self-start" priority />
        <div className="flex flex-wrap items-center gap-3"><BitBadge font="normal" className="text-[10px] tracking-wider">AI ROBOT MISSION</BitBadge><Kicker>De Turing à une caméra intelligente</Kicker></div>
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_0.8fr]">
          <div><h1 className="text-balance text-4xl font-bold leading-none tracking-tight md:text-6xl">Comment une machine apprend-elle à voir ?</h1><Lead className="mt-4">Nous allons suivre 70 ans d’idées, ouvrir une image pixel par pixel, entraîner un réseau, puis détecter des objets sur un XIAO avec caméra.</Lead></div>
          <PixelBurstHero />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Card title="1 · Comprendre">Ce que l’IA fait vraiment.</Card><Card title="2 · Expérimenter">Prédire, manipuler, observer.</Card><Card title="3 · Relier">Données + GPU + réseaux.</Card><Card title="4 · Construire" tone="positive">Une détection embarquée.</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'what-is-ai', chapter: 'IA ?', kicker: 'Point de départ · une définition utile', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Qu’est-ce que l’IA ?</Kicker><Title>Une machine réalise une tâche qui demande habituellement de percevoir, apprendre, raisonner ou décider</Title><div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Card title="Percevoir">Reconnaître une voix ou un objet.</Card><Card title="Apprendre">S’améliorer grâce à des exemples.</Card><Card title="Décider">Choisir une action selon une situation.</Card><Card title="Créer">Produire du texte, une image ou du son.</Card></div><Callout label="Cadrage honnête">Une IA n’est pas une personne numérique. Elle apprend des régularités mathématiques pour réussir une tâche précise.</Callout></div>,
  },
  {
    id: 'ai-or-automation', chapter: 'IA ?', kicker: 'Interaction · vote de la classe', minutes: 2, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>IA ou simple automatisation ?</Kicker><Title>Si une machine suit seulement une règle fixe, apprend-elle vraiment ?</Title><PredictReveal id="thermostat-ai" question="Un thermostat classique allume la climatisation quand la température dépasse 25 °C. Est-ce de l’apprentissage automatique ?" options={[{ label: 'Oui, il décide' }, { label: 'Non, règle écrite' }, { label: 'Seulement avec Internet' }]} correctIndex={1} explanation={<p>La décision vient d’une règle écrite par un humain. Un thermostat qui apprendrait vos habitudes à partir de données utiliserait, lui, de l’apprentissage automatique.</p>} /><div className="grid grid-cols-3 gap-3"><Card>Filtre anti-spam qui s’adapte</Card><Card>Feu tricolore avec minuterie</Card><Card>Caméra qui reconnaît un visage</Card></div></div>,
  },
  {
    id: 'rules-vs-examples', chapter: 'IA ?', kicker: 'Le changement de méthode', minutes: 3, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Programmer ou faire apprendre</Kicker><Title>Avec un programme, nous écrivons les règles. Avec le ML, nous montrons des exemples.</Title><div className="grid gap-5 lg:grid-cols-2"><Card title="Programme classique"><Flow direction="horizontal" steps={[{ label: 'Règles' }, { label: 'Données' }, { label: 'Réponse', strong: true }]} /><p className="mt-3 text-sm text-muted-foreground">Parfait quand les règles sont claires : calculer un prix, trier des nombres.</p></Card><Card title="Apprentissage automatique" tone="positive"><Flow direction="horizontal" steps={[{ label: 'Exemples + réponses' }, { label: 'Entraînement' }, { label: 'Modèle', strong: true }]} /><p className="mt-3 text-sm text-muted-foreground">Utile quand les règles seraient impossibles à écrire : reconnaître tous les chats possibles.</p></Card></div><Callout label="Analogie courte">Au lieu de donner une recette complète, on corrige un élève après de nombreux exercices jusqu’à ce qu’il trouve la méthode.</Callout></div>,
  },

  {
    id: 'turing-dartmouth', chapter: 'Histoire', kicker: '1950–1956 · la question devient un domaine', minutes: 2, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>Avant les grands modèles</Kicker><Title>Tout commence par une question : une machine peut-elle montrer un comportement intelligent ?</Title><div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]"><ArchiveImage src="/history/alan-turing.jpg" alt="Portrait en noir et blanc d’Alan Turing à Princeton en 1936" caption="Alan Turing à Princeton, 1936" credit="Wikimedia Commons · domaine public" className="h-56 lg:h-full" position="center 28%" /><div className="grid gap-3"><Card title="1950 · Le test de Turing"><p className="text-muted-foreground">Turing propose d’évaluer une machine par une conversation : peut-elle produire des réponses difficiles à distinguer de celles d’un humain ?</p></Card><Card title="1956 · Dartmouth" tone="positive"><p className="text-muted-foreground">Des chercheurs donnent un nom au projet : <Term>intelligence artificielle</Term>. Leur ambition est immense, les ordinateurs encore minuscules.</p></Card></div></div><Prose>Le test de Turing n’est pas une preuve de conscience : c’est une manière d’observer un comportement.</Prose></div>,
  },
  {
    id: 'perceptron-winters', chapter: 'Histoire', kicker: '1958–1990 · enthousiasme, limites, retours', minutes: 2, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>Une idée en avance sur ses moyens</Kicker><Title>Le neurone artificiel apprend tôt, mais la puissance et les données ne suivent pas</Title><div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><ArchiveImage src="/history/mark-i-perceptron.jpg" alt="Le Mark I Perceptron, machine expérimentale de reconnaissance visuelle" caption="Le Mark I Perceptron et son « œil » de photocellules" credit="U.S. Navy · domaine public" className="h-56 lg:h-full" position="center 42%" /><div className="grid gap-3"><Card title="1958 · Perceptron" tone="positive">Une machine ajuste des poids pour séparer des exemples simples.</Card><Card title="Années 1970–1980" tone="negative">Les résultats déçoivent. Les financements baissent : ce sont les « hivers de l’IA ».</Card><Card title="Années 1980">Les systèmes experts reviennent avec des milliers de règles humaines, mais restent fragiles et coûteux.</Card></div></div><Callout label="À retenir">Une bonne idée ne suffit pas. Il faut aussi des données, des machines capables de calculer et une méthode qui passe à grande échelle.</Callout></div>,
  },
  {
    id: 'history-game', chapter: 'Histoire', kicker: 'Interaction · reconstruire le temps', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Mission chronologie</Kicker><Title className="text-2xl md:text-3xl">Replacez les cinq tournants qui nous conduisent jusqu’aux réseaux modernes</Title><HistoryTimeline /></div>,
  },

  {
    id: 'what-learning-means', chapter: 'Apprendre', kicker: 'Les bases · généraliser', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Apprendre à partir d’exemples</Kicker><Title>Le but n’est pas de mémoriser. C’est de réussir sur un exemple jamais vu.</Title><div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]"><Card><Flow direction="horizontal" steps={[{ label: 'Exemples connus' }, { label: 'Motifs appris' }, { label: 'Nouvelle image', strong: true }, { label: 'Prédiction' }]} /></Card><Callout label="Le mot important"><Term>Généraliser</Term>, c’est reconnaître un chien nouveau, sous un angle nouveau, parce qu’on a appris ce qui compte au-delà des photos mémorisées.</Callout></div></div>,
  },
  {
    id: 'supervised-loop', chapter: 'Apprendre', kicker: 'Les bases · apprentissage supervisé', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Une réponse accompagne chaque exemple</Kicker><Title>Prédire, comparer, corriger, recommencer</Title><Flow direction="horizontal" steps={[{ label: 'Image + étiquette' }, { label: 'Prédiction' }, { label: 'Erreur' }, { label: 'Ajuster', strong: true }, { label: 'Répéter' }]} /><PredictReveal id="unseen-cat" question="Après 1 000 chats vus de face, le modèle reçoit un chat vu de dos. Quel risque est le plus probable ?" options={[{ label: 'Aucun risque' }, { label: 'Il peut se tromper' }, { label: 'Il refuse toujours' }]} correctIndex={1} explanation={<p>Si les données manquent de variété, le modèle apprend des raccourcis. Il faut varier angles, lumières, arrière-plans et individus.</p>} /></div>,
  },
  {
    id: 'data-labels', chapter: 'Apprendre', kicker: 'Les bases · qualité des données', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Les données sont l’expérience du modèle</Kicker><Title>Un modèle apprend les exemples qu’on lui donne, y compris leurs erreurs</Title><div className="grid grid-cols-3 gap-4"><Card title="Variées">Angles, distances, lumières et arrière-plans différents.</Card><Card title="Bien étiquetées">Chaque image porte la bonne classe ou la bonne position.</Card><Card title="Équilibrées" tone="positive">Assez d’exemples pour chaque objet, sans classe dominante.</Card></div><Callout label="Piège">Si toutes les bananes sont photographiées sur une table rouge, le modèle peut apprendre « table rouge » au lieu de « banane ».</Callout></div>,
  },
  {
    id: 'images-are-numbers', chapter: 'Apprendre', kicker: 'Vision · passer du monde aux nombres', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Que voit l’ordinateur ?</Kicker><Title>Une image est une grille. Chaque pixel contient trois nombres : rouge, vert, bleu.</Title><div className="grid grid-cols-3 gap-4"><Stat value="0–255" label="valeur de chaque canal" /><Stat value="3" label="canaux R, V et B" /><Stat value="224×224" label="taille courante d’entrée" /></div><Card><Flow direction="horizontal" steps={[{ label: 'Lumière' }, { label: 'Capteur caméra' }, { label: 'Pixels RVB' }, { label: 'Matrice de nombres', strong: true }]} /></Card></div>,
  },
  {
    id: 'pixel-explorer', chapter: 'Apprendre', kicker: 'Interaction · ouvrir une image', minutes: 4, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Exploration des pixels</Kicker><Title className="text-2xl md:text-3xl">Explosez l’image, puis inspectez ce que la machine reçoit réellement</Title><PixelExplorer /></div>,
  },
  {
    id: 'model-inference', chapter: 'Apprendre', kicker: 'Les bases · deux moments différents', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Entraînement ≠ utilisation</Kicker><Title>On apprend sur une grosse machine, puis on exécute le modèle sur le XIAO</Title><div className="grid gap-5 lg:grid-cols-2"><Card title="Entraînement"><BulletList items={[<>Beaucoup d’images étiquetées</>, <>Calculs répétés et coûteux</>, <>Les poids changent</>]} /></Card><Card title="Inférence" tone="positive"><BulletList items={[<>Une nouvelle image de caméra</>, <>Un seul passage rapide</>, <>Les poids restent fixes</>]} /></Card></div><Prose>Le fichier du modèle contient des poids appris, pas un album des images originales.</Prose></div>,
  },

  {
    id: 'neural-network', chapter: 'Réseaux', kicker: 'Réseaux de neurones · structure', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Des calculs organisés en couches</Kicker><Title>Chaque couche transforme les nombres et transmet ce qu’elle juge utile</Title><Card><Flow direction="horizontal" steps={[{ label: 'Pixels' }, { label: 'Couche 1', hint: 'contours' }, { label: 'Couche 2', hint: 'textures' }, { label: 'Couche 3', hint: 'formes' }, { label: 'Objet', strong: true }]} /></Card><div className="grid grid-cols-3 gap-3"><Card title="Entrées">Les nombres reçus.</Card><Card title="Poids">L’importance de chaque connexion.</Card><Card title="Activation">Le signal transmis à la suite.</Card></div></div>,
  },
  {
    id: 'neuron-lab', chapter: 'Réseaux', kicker: 'Interaction · régler une connexion', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Dans un neurone artificiel</Kicker><Title className="text-2xl md:text-3xl">Déplacez le poids : le même signal peut être renforcé, ignoré ou freiné</Title><NeuronLab /><Callout label="Pas de magie">Un neurone multiplie, additionne puis applique un seuil ou une fonction. La puissance vient de millions de petits réglages reliés.</Callout></div>,
  },
  {
    id: 'deep-layers', chapter: 'Réseaux', kicker: 'Réseaux de neurones · profondeur', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Pourquoi « deep learning » ?</Kicker><Title>Profond signifie simplement : beaucoup de couches de transformations</Title><div className="grid grid-cols-4 gap-3"><Card title="Pixels">Valeurs brutes</Card><Card title="Début">Bords et couleurs</Card><Card title="Milieu">Textures et parties</Card><Card title="Fin" tone="positive">Objet complet</Card></div><Prose>Personne ne programme « cherche une oreille ». Pendant l’entraînement, les couches découvrent les caractéristiques utiles pour réduire l’erreur.</Prose></div>,
  },
  {
    id: 'learning-from-error', chapter: 'Réseaux', kicker: 'Réseaux de neurones · entraînement', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Corriger des millions de réglages</Kicker><Title>L’erreur indique dans quelle direction ajuster chaque poids</Title><Flow direction="horizontal" steps={[{ label: 'Prédire : chat 30 %' }, { label: 'Vérité : chat' }, { label: 'Mesurer la perte' }, { label: 'Ajuster les poids', strong: true }]} /><div className="grid grid-cols-2 gap-4"><Card title="Pas trop petit">L’apprentissage avance très lentement.</Card><Card title="Pas trop grand" tone="negative">On dépasse la bonne zone et l’erreur rebondit.</Card></div></div>,
  },
  {
    id: 'training-simulator', chapter: 'Réseaux', kicker: 'Interaction · ressentir l’entraînement', minutes: 4, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Simulateur d’apprentissage</Kicker><Title className="text-2xl md:text-3xl">Changez la taille du pas : regardez la perte descendre… ou rebondir</Title><TrainingSimulator /></div>,
  },
  {
    id: 'why-cnn', chapter: 'Réseaux', kicker: 'Vision · réseaux convolutifs', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Un réseau adapté aux images</Kicker><Title>Un CNN cherche de petits motifs partout dans l’image</Title><div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]"><Card title="Même motif, autre endroit"><div className="grid grid-cols-5 gap-2">{['↖','↑','↗','←','→','↙','↓','↘','◎','◇'].map((shape, index) => <span key={index} className="rounded border bg-secondary p-3 text-center text-xl">{shape}</span>)}</div></Card><Callout label="Idée clé">Un filtre appris glisse sur l’image. Il peut repérer un bord en haut à gauche ou en bas à droite avec les mêmes poids.</Callout></div></div>,
  },
  {
    id: 'convolution', chapter: 'Réseaux', kicker: 'Interaction · convolution', minutes: 4, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Le filtre en action</Kicker><Title className="text-2xl md:text-3xl">Faites glisser une fenêtre 3×3 et construisez une carte de caractéristiques</Title><ConvolutionDemo /></div>,
  },

  {
    id: 'internet-data', chapter: 'Déclic 2012', kicker: 'Années 1990–2000 · le carburant arrive', minutes: 2, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>Pourquoi l’IA accélère soudainement</Kicker><Title>Internet et les appareils numériques produisent une quantité gigantesque d’exemples</Title><div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><div className="grid gap-3"><Card title="Web">Textes, pages et images deviennent accessibles.</Card><Card title="Caméras">Téléphones et capteurs créent des milliards d’images.</Card><Card title="Étiquettes" tone="positive">Des humains nomment, classent et corrigent les exemples.</Card></div><ArchiveImage src="/history/digital-media.jpg" alt="Groupe de personnes utilisant leurs smartphones" caption="Des milliards de capteurs deviennent des sources de données" credit="Rawpixel.com · CC0" className="h-56 lg:h-full" /></div><Callout label="Nuance">Plus de données n’est pas automatiquement mieux : la qualité, le consentement, la diversité et les biais comptent.</Callout></div>,
  },
  {
    id: 'why-gpu', chapter: 'Déclic 2012', kicker: 'Le calcul · beaucoup de multiplications', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Le second ingrédient</Kicker><Title>Les jeux vidéo avaient déjà créé la machine idéale pour entraîner des réseaux</Title><div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]"><div className="grid gap-3"><Card title="CPU"><div className="font-mono text-4xl">4–16</div><p className="mt-2 text-sm text-muted-foreground">Quelques cœurs flexibles pour des tâches variées.</p></Card><Card title="GPU" tone="positive"><div className="font-mono text-4xl text-primary">1000+</div><p className="mt-2 text-sm text-muted-foreground">Beaucoup de petits cœurs pour répéter le même calcul en parallèle.</p></Card></div><ArchiveImage src="/history/geforce-gtx-280.jpg" alt="Carte graphique NVIDIA GeForce GTX 280 démontée" caption="Un GPU : beaucoup de calculs effectués en parallèle" credit="Fritzchens Fritz · CC0" className="h-56 lg:h-full" /></div><Prose>Les réseaux utilisent surtout des multiplications de matrices : exactement le type de travail qu’un GPU peut paralléliser.</Prose></div>,
  },
  {
    id: 'gpu-race', chapter: 'Déclic 2012', kicker: 'Interaction · calcul séquentiel ou parallèle', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Course CPU contre GPU</Kicker><Title className="text-2xl md:text-3xl">Même grille de calculs, deux manières de travailler</Title><GpuRace /></div>,
  },
  {
    id: 'imagenet', chapter: 'Déclic 2012', kicker: '2009 · un terrain d’entraînement commun', minutes: 2, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>ImageNet</Kicker><Title>Des millions d’images étiquetées permettent enfin de comparer les modèles sur le même défi</Title><div className="grid grid-cols-3 gap-4"><Stat value="14 M+" label="images dans le projet complet" /><Stat value="20 k+" label="catégories organisées" /><Stat value="1 000" label="classes du concours classique" /></div><Card><Flow direction="horizontal" steps={[{ label: 'Même jeu de données' }, { label: 'Même test' }, { label: 'Scores comparables' }, { label: 'Progrès visible', strong: true }]} /></Card></div>,
  },
  {
    id: 'imagenet-challenge', chapter: 'Déclic 2012', kicker: 'Interaction · repérer un mauvais raccourci', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Que va réellement apprendre le modèle ?</Kicker><Title>Le contexte peut être plus facile à apprendre que l’objet</Title><PredictReveal id="cow-background" question="Toutes les photos de vaches montrent de l’herbe verte. Sur quoi le modèle risque-t-il de s’appuyer ?" options={[{ label: 'La forme de la vache' }, { label: 'L’herbe verte' }, { label: 'La date du fichier' }]} correctIndex={1} explanation={<p>Un modèle cherche le raccourci statistique le plus utile. Il faut donc varier les contextes et tester sur des situations nouvelles.</p>} /><div className="grid grid-cols-3 gap-3"><Card>Vache sur herbe</Card><Card>Vache sur route</Card><Card tone="positive">Vache en gros plan</Card></div></div>,
  },
  {
    id: 'alexnet', chapter: 'Déclic 2012', kicker: '2012 · la démonstration', minutes: 3, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>AlexNet</Kicker><Title>Un CNN profond entraîné sur GPU gagne ImageNet avec une avance spectaculaire</Title><div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]"><Card><Flow direction="horizontal" steps={[{ label: 'ImageNet', hint: 'données' }, { label: 'GPU', hint: 'calcul' }, { label: 'CNN', hint: 'méthode' }, { label: 'AlexNet', strong: true }]} /></Card><Card title="Le déclic" tone="positive">Les réseaux de neurones ne sont plus seulement une vieille idée intéressante : ils deviennent la meilleure méthode pour comprendre les images à grande échelle.</Card></div><Callout label="Le trio à retenir">Les données nourrissent le modèle, le GPU rend les essais possibles et le réseau apprend les motifs.</Callout></div>,
  },

  {
    id: 'from-images-to-language', chapter: 'ChatGPT', kicker: 'Des pixels aux séquences', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>La même logique change de média</Kicker><Title>Pour le langage, le modèle apprend les motifs entre des morceaux de texte</Title><div className="grid grid-cols-2 gap-5"><Card title="Vision"><Flow direction="horizontal" steps={[{ label: 'Pixels' }, { label: 'Motifs visuels' }, { label: 'Objet', strong: true }]} /></Card><Card title="Langage" tone="positive"><Flow direction="horizontal" steps={[{ label: 'Tokens' }, { label: 'Motifs de texte' }, { label: 'Token suivant', strong: true }]} /></Card></div><Prose>Un <Term>token</Term> peut être un mot, une partie de mot ou un signe de ponctuation.</Prose></div>,
  },
  {
    id: 'token-game', chapter: 'ChatGPT', kicker: 'Interaction · prochain token', minutes: 3, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Jouez comme un modèle de langage</Kicker><Title className="text-2xl md:text-3xl">Quel morceau de texte devrait venir ensuite ?</Title><TokenPredictor /></div>,
  },
  {
    id: 'openai-chatgpt', chapter: 'ChatGPT', kicker: '2015–2022 · IA générative', minutes: 3, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>OpenAI et ChatGPT</Kicker><Title>Un grand modèle de langage devient une interface de conversation accessible à tous</Title><div className="grid grid-cols-3 gap-4"><Card title="2015">Création d’OpenAI, laboratoire de recherche en IA.</Card><Card title="2018–2020">Les modèles GPT apprennent à générer du texte à une échelle croissante.</Card><Card title="2022" tone="positive">ChatGPT transforme cette capacité en dialogue simple à utiliser.</Card></div><Callout label="Limite essentielle">Prédire une suite plausible ne garantit ni vérité ni compréhension humaine. Il faut vérifier les faits, les sources et les conséquences.</Callout></div>,
  },

  {
    id: 'classification-detection', chapter: 'Détection', kicker: 'Vision · trois questions différentes', minutes: 2, kind: 'concept',
    content: <div className="deck-slide"><Kicker>Voir plus qu’une étiquette</Kicker><Title>Classifier dit « quoi ». Détecter dit « quoi, combien et où ».</Title><div className="grid grid-cols-3 gap-4"><Card title="Classification">Cette image contient surtout une pomme.</Card><Card title="Localisation">La pomme est à cet endroit.</Card><Card title="Détection" tone="positive">Voici chaque pomme, banane et patate présente.</Card></div><Flow direction="horizontal" steps={[{ label: 'Image caméra' }, { label: 'Caractéristiques CNN' }, { label: 'Classes + positions', strong: true }]} /></div>,
  },
  {
    id: 'fomo-demo', chapter: 'Détection', kicker: 'Interaction · classification contre détection', minutes: 4, kind: 'interaction',
    content: <div className="deck-slide"><Kicker>Une scène, plusieurs objets</Kicker><Title className="text-2xl md:text-3xl">Basculez de la classification à FOMO, puis lancez le balayage</Title><FomoDetector /></div>,
  },
  {
    id: 'fomo-tradeoffs', chapter: 'Détection', kicker: 'TinyML · choisir le bon compromis', minutes: 3, kind: 'concept',
    content: <div className="deck-slide"><Kicker>FOMO : Faster Objects, More Objects</Kicker><Title>Pour tenir sur un microcontrôleur, FOMO prédit un centre plutôt qu’une boîte complète</Title><div className="grid grid-cols-3 gap-4"><Card title="Léger" tone="positive">Peu de mémoire et calcul rapide.</Card><Card title="Utile">Compter, trier ou déclencher une action.</Card><Card title="Limite" tone="negative">Deux objets collés peuvent fusionner ; leur taille n’est pas prédite.</Card></div><PredictReveal id="fomo-touching" question="Deux objets identiques se touchent dans la même zone. Que risque de produire FOMO ?" options={[{ label: 'Deux centres parfaits' }, { label: 'Un centre fusionné' }, { label: 'Une boîte géante' }]} correctIndex={1} explanation={<p>Les zones voisines peuvent se regrouper en un seul centroïde. C’est un compromis du modèle léger, pas une preuve que la caméra est cassée.</p>} /></div>,
  },

  {
    id: 'xiao-pipeline', chapter: 'Mission XIAO', kicker: 'Projet final · de la caméra à une action', minutes: 4, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>La mission embarquée</Kicker><Title>Construire un détecteur d’objets qui fonctionne sans ordinateur puissant</Title><Flow direction="horizontal" steps={[{ label: '1 · Collecter', hint: 'images variées' }, { label: '2 · Étiqueter', hint: 'objet + position' }, { label: '3 · Entraîner', hint: 'FOMO sur le cloud' }, { label: '4 · Quantifier', hint: 'poids 8 bits' }, { label: '5 · Déployer', hint: 'XIAO + caméra' }, { label: '6 · Réagir', strong: true, hint: 'LED, moteur, alerte' }]} /><div className="grid grid-cols-3 gap-4"><Card title="Entrée">Une image capturée en direct.</Card><Card title="Inférence">Le modèle calcule classes et centres.</Card><Card title="Sortie" tone="positive">Le XIAO prend une décision localement.</Card></div><Callout label="Pourquoi embarquer ?">Faible latence, fonctionnement hors ligne et images pouvant rester sur l’appareil.</Callout></div>,
  },
  {
    id: 'close', chapter: 'Mission XIAO', kicker: 'Conclusion · relier toute l’histoire', minutes: 3, kind: 'milestone',
    content: <div className="deck-slide"><Kicker>Vous pouvez maintenant raconter le parcours</Kicker><Title>D’une question en 1950 à une caméra intelligente dans votre main</Title><div className="grid grid-cols-4 gap-3"><Card title="Idée">Apprendre des motifs dans des exemples.</Card><Card title="Carburant">Internet rend les données disponibles.</Card><Card title="Moteur">Les GPU rendent les calculs possibles.</Card><Card title="Résultat" tone="positive">Un modèle compact détecte sur le XIAO.</Card></div><Flow direction="horizontal" steps={[{ label: 'Pixels' }, { label: 'Convolution' }, { label: 'Caractéristiques' }, { label: 'Objets + positions' }, { label: 'Action réelle', strong: true }]} /><Callout label="Dernière question pour la classe">Quel problème réel autour de vous pourrait être résolu par une petite caméra qui détecte des objets sans envoyer ses images sur Internet ?</Callout></div>,
  },
  ...tutorialSlides,
]
