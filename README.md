# DAUST Summer Camp 2026, AI Robot Mission

A slide deck for the DAUST Summer Camp 2026 AI class. It walks through how machines see images, how classifiers learn, how convolutional networks work, and how to train and deploy a small model on the Seeed Studio XIAO board. The content is in French.

## What is in it

58 slides across 9 chapters: Départ, Qu'est-ce que l'IA, Apprentissage & Données, Images, Réseaux de neurones, CNN, Détection d'objets, Bien entraîner, and TinyML & XIAO.

Five interactive demos are built into the deck:

- A pixel and RGB explorer that bursts a photo into its individual pixels
- A convolution demo where you slide a 3x3 filter across an image and watch a feature map form
- A training simulator that shows loss and accuracy curves for different learning rates
- A confusion matrix you can fill in by classifying sample images
- An object detection demo comparing single-label classification against a grid based centroid detector

## Running it

```
pnpm install
pnpm dev
```

Then open http://localhost:3000. Use the arrow keys, space, or the on-screen buttons to move between slides.

```
pnpm build
pnpm start
```

builds and serves a production version.

## Structure

```
app/                 Next.js app router entry point, global styles
components/deck/      Slide deck shell, shared slide building blocks, slide content
components/demos/     The interactive demo components
components/ui/        Base UI primitives, including an 8-bit accent set for buttons and progress bars
lib/                  Small shared utilities
public/                Static assets
```

## Stack

Next.js, React, TypeScript, and Tailwind CSS, with shadcn/ui components and an 8bitcn/ui accent set for the retro button and progress styling.

## Navigation

- Arrow right, page down, or space: next slide
- Arrow left or page up: previous slide
- Home: first slide
- End: last slide
- The chapter rail and the progress trail at the top are both clickable
