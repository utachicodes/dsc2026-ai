# DAUST Summer Camp 2026, AI Robot Mission

A slide deck for the DAUST Summer Camp 2026 AI class. It walks through how machines see images, how classifiers learn, how convolutional networks work, and how to train and deploy a small model on the Seeed Studio XIAO board. The core content is in French, with an English hands-on object detection tutorial at the end.

## What is in it

54 slides across 9 chapters — the 8 core chapters (IA ?, Histoire, Apprendre, Réseaux, Déclic 2012, ChatGPT, Détection, Mission XIAO) plus an optional bonus chapter at the end: a fully interactive, English-language object detection tutorial following the 4.5 FOMO hands-on (capture, label, train, deploy on the XIAO ESP32S3 Sense), for anyone who finishes early.

Interactive demos are built into the deck:

- A pixel and RGB explorer that bursts a photo into its individual pixels
- A convolution demo where you slide a 3x3 filter across an image and watch a feature map form
- A training simulator that shows loss and accuracy curves for different learning rates
- A confusion matrix you can fill in by classifying sample images
- An object detection demo comparing single-label classification against a grid based centroid detector
- A count-and-scan game: guess how many objects are in a scene, then FOMO sweeps a 12x12 grid and drops a centroid per object
- A labeling game where you drag bounding boxes around objects and get scored with IoU, just like the Edge Impulse labeling queue
- A bounding-box lesson that flips the same camera frame between "raw photo" and "labeled for training" to show what ground truth means
- A bilingual (EN/FR) classification-vs-detection lesson that shows the same scene answered by a single-label classifier versus a detector
- A camera web-server simulator: start the stream, pick QVGA, and save frames until 50 training photos pile up
- A training simulator: press "Start training" and watch 60 epochs run, loss fall, and F1 climb to 85%
- A preprocessing demo that squashes 320x240 color frames into 96x96 grayscale tiles
- A data augmentation switcher that turns 47 photos into thousands of training samples
- A dataset balancer that rebalances classes and splits off a held-out test set

A few key concept slides also include predict-then-reveal challenges: pick an answer before the mechanism is
explained, and a running score shows in the footer. The workflow slides use checklists instead of static bullet
points, with progress saved locally as steps get checked off, and every tutorial step carries a collapsible
"Why?" section that explains the idea behind the click in plain language. The object detection tutorial ships real
Arduino code (camera model define, Wi-Fi credentials, and the full XIAO ESP32S3 Sense pin map) in terminal-style
snippets with one-click copy buttons. The deploy step also ships the real XIAO ESP32S3 Sense pin map
as a copyable Arduino snippet.

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
