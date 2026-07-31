import type { Slide } from './slides'
import { BulletList, Callout, Card, Flow, Kicker, Lead, Prose, Stat, Term, Title } from './primitives'
import { PredictReveal } from './predict-reveal'
import { Checklist } from './checklist'
import { CodeSnippet } from './code-snippet'
import { Why } from './why'
import { Badge as BitBadge } from '@/components/ui/8bit/badge'
import { CountScanGame } from '@/components/demos/count-scan-game'
import { LabelingGame } from '@/components/demos/labeling-game'
import { DataAugmentation } from '@/components/demos/data-augmentation'
import { PreprocessDemo } from '@/components/demos/preprocess-demo'
import { DatasetBalancer } from '@/components/demos/dataset-balancer'
import { BoxLesson } from '@/components/demos/box-lesson'
import { ClassVsDetect } from '@/components/demos/class-vs-detect'
import { CameraSimulator } from '@/components/demos/camera-simulator'
import { TrainingDemo } from '@/components/demos/training-demo'

export const TUTORIAL_CHAPTER = 'Tutorial' as const

const PIN_CODE = `#define PWDN_GPIO_NUM     -1
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM     10
#define SIOD_GPIO_NUM     40
#define SIOC_GPIO_NUM     39
#define Y9_GPIO_NUM       48
#define Y8_GPIO_NUM       11
#define Y7_GPIO_NUM       12
#define Y6_GPIO_NUM       14
#define Y5_GPIO_NUM       16
#define Y4_GPIO_NUM       18
#define Y3_GPIO_NUM       17
#define Y2_GPIO_NUM       15
#define VSYNC_GPIO_NUM    38
#define HREF_GPIO_NUM     47
#define PCLK_GPIO_NUM     13`

export const tutorialSlides: Slide[] = [
  {
    id: 'tutorial-cover',
    chapter: TUTORIAL_CHAPTER,
    kicker: '4.5 Object Detection · FOMO hands-on',
    minutes: 2,
    kind: 'milestone',
    content: (
      <div className="deck-slide">
        <div className="flex flex-wrap items-center gap-3">
          <BitBadge font="normal" className="text-[10px] tracking-wider">FOMO · TINYML</BitBadge>
          <Kicker>The Object Detection Mission</Kicker>
        </div>
        <div className="grid items-center gap-6 lg:grid-cols-[1.35fr_0.8fr]">
          <div>
            <Title className="text-3xl md:text-4xl">Find the oranges. Catch the frogs.</Title>
            <Lead className="mt-4">
              From raw camera frames to a model that locates and counts objects on a tiny microcontroller. We will
              capture, label, train and deploy — on the XIAO ESP32S3 Sense.
            </Lead>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card title="Hardware">Seeed XIAO ESP32S3 Sense × 1 — camera and brain in your palm.</Card>
            <Card title="Software" tone="positive">Arduino IDE + Edge Impulse Studio.</Card>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <Card title="1 · Capture">Photos from the XIAO camera</Card>
          <Card title="2 · Label">Bounding boxes in Edge Impulse</Card>
          <Card title="3 · Train">FOMO · 96×96 grayscale</Card>
          <Card title="4 · Deploy" tone="positive">Run on the XIAO + SenseCraft</Card>
        </div>
      </div>
    ),
  },
  {
    id: 'meet-the-xiao',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Zero to hero · the gear',
    minutes: 2,
    kind: 'concept',
    content: (
      <div className="deck-slide">
        <Kicker>Zero to hero · the gear</Kicker>
        <Title>Your tiny computer: a brain with a camera</Title>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card title="Microcontroller">
            <p className="text-sm text-muted-foreground">
              A <Term>microcontroller</Term> is a tiny computer. No screen, no keyboard — you give it orders with
              code.
            </p>
            <BulletList
              items={[
                <>Cheap, small and power-sipping</>,
                <>Built for one job at a time</>,
                <>A laptop is fast and flexible — but huge in comparison</>,
              ]}
            />
          </Card>
          <Card title="The XIAO ESP32S3 Sense" tone="positive">
            <BulletList
              items={[
                <>Microcontroller + camera, all in your palm</>,
                <>Wi-Fi built in, so it can stream what it sees</>,
                <>Starts with an empty head — programming fills it</>,
              ]}
            />
          </Card>
        </div>
        <Callout label="Analogy">
          The XIAO is a tiny robot brain. It cannot browse the web, but it can sit inside a sorting machine and watch
          fruit all day.
        </Callout>
      </div>
    ),
  },
  {
    id: 'what-is-arduino',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Zero to hero · Arduino',
    minutes: 3,
    kind: 'concept',
    content: (
      <div className="deck-slide">
        <Kicker>Zero to hero · Arduino</Kicker>
        <Title>Arduino is how you give the XIAO its orders</Title>
        <Flow
          direction="horizontal"
          steps={[{ label: 'Write code' }, { label: 'Click Upload' }, { label: 'The XIAO obeys', strong: true }]}
        />
        <div className="grid grid-cols-3 gap-3">
          <Card title="Arduino IDE">
            A free app on your laptop where you write code and press Upload. (IDE just means a program where you
            program.)
          </Card>
          <Card title="Sketch">The name of an Arduino program — a handful of simple lines of code.</Card>
          <Card title="Library" tone="positive">
            Ready-made code so you do not reinvent the camera — you just call it.
          </Card>
        </div>
        <Callout label="Analogy">
          The IDE is the remote control, the board is the toy. Libraries are the batteries — already inside, ready to
          use.
        </Callout>
      </div>
    ),
  },
  {
    id: 'what-is-edge-impulse',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Zero to hero · Edge Impulse',
    minutes: 3,
    kind: 'concept',
    content: (
      <div className="deck-slide">
        <Kicker>Zero to hero · Edge Impulse</Kicker>
        <Title>Edge Impulse: the online school where your AI learns</Title>
        <Prose>
          Teaching a computer to see needs millions of calculations. Edge Impulse does all of them in your browser —
          you never write any math. You just upload photos, label them, and press Train.
        </Prose>
        <Flow
          direction="horizontal"
          steps={[
            { label: 'Upload photos' },
            { label: 'Label them' },
            { label: 'Train', strong: true },
            { label: 'Download model' },
            { label: 'Put on XIAO' },
          ]}
        />
        <div className="grid grid-cols-3 gap-3">
          <Card title="Data acquisition">The screen where you upload your photos.</Card>
          <Card title="Labeling queue">The to-do list of photos waiting for you to mark them.</Card>
          <Card title="Deploy" tone="positive">
            “Make me a file I can put on the XIAO.”
          </Card>
        </div>
        <Callout label="Analogy">
          Arduino is the muscle, Edge Impulse is the school. The brain learns online because learning needs a big
          computer.
        </Callout>
      </div>
    ),
  },
  {
    id: 'bounding-boxes-basics',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Zero to hero · bounding boxes',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Zero to hero · bounding boxes</Kicker>
        <Title>Bounding boxes: the answers you give the computer</Title>
        <BoxLesson />
        <PredictReveal
          lang="en"
          id="ground-truth"
          question="A model trained on 50 labeled photos can find objects in new photos because…"
          options={[
            { label: 'It copies your answers and spots the pattern' },
            { label: 'It memorizes the 50 photos' },
            { label: 'It reads a Wikipedia article' },
          ]}
          correctIndex={0}
          explanation={
            <p>
              Your labeled boxes are the “ground truth” — the correct answers. The model finds the pattern behind them,
              which is why good labels make good models.
            </p>
          }
        />
        <Callout label="FOMO twist">
          You still draw boxes while labeling, but FOMO predicts only a center dot per object — just enough to count
          them.
        </Callout>
      </div>
    ),
  },
  {
    id: 'one-label-is-not-enough',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Object Detection vs Image Classification',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <ClassVsDetect />
      </div>
    ),
  },
  {
    id: 'bounding-boxes-are-heavy',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Why not MobileNet SSD or YOLO?',
    minutes: 2,
    kind: 'concept',
    content: (
      <div className="deck-slide">
        <Kicker>Why not MobileNet SSD or YOLO?</Kicker>
        <Title>Bounding-box models are too heavy for the XIAO</Title>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="The old way">
            <Flow direction="horizontal" steps={[{ label: 'SSD / YOLO' }, { label: 'Box + size' }, { label: 'Many MB', strong: true }]} />
            <p className="mt-3 text-sm text-muted-foreground">
              Perfect on a Raspberry Pi. Way too big for a chip with less than 1 MB of RAM.
            </p>
          </Card>
          <Card title="FOMO" tone="positive">
            <Flow direction="horizontal" steps={[{ label: 'Grid cells' }, { label: 'Scores' }, { label: 'Centroids', strong: true }]} />
            <p className="mt-3 text-sm text-muted-foreground">
              No box, no size — just class + position. Runs in under 200 KB of RAM.
            </p>
          </Card>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat value="30×" label="less energy & memory than SSD / YOLO" />
          <Stat value="<200 KB" label="of RAM is enough for FOMO" />
          <Stat value="~7 fps" label="real-time on the XIAO" />
        </div>
      </div>
    ),
  },
  {
    id: 'count-scan-game',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Interactive · how FOMO sees a scene',
    minutes: 4,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Interactive · how FOMO sees a scene</Kicker>
        <Title className="text-2xl md:text-3xl">Count the objects by eye — then let FOMO scan the grid</Title>
        <CountScanGame />
      </div>
    ),
  },
  {
    id: 'mission-goal',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'The project goal',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>The project goal</Kicker>
        <Title>Sort and count oranges and frogs in a facility</Title>
        <div className="grid grid-cols-3 gap-3">
          <Card title="What">Fruit or bug?</Card>
          <Card title="Where">A centroid on the image</Card>
          <Card title="How many" tone="positive">Count them per frame</Card>
        </div>
        <PredictReveal
          lang="en"
          id="fomo-no-size"
          question="Which of these does FOMO NOT output?"
          options={[{ label: 'A centroid per object' }, { label: 'The class of each object' }, { label: 'The exact size of each object' }]}
          correctIndex={2}
          explanation={
            <p>
              FOMO tells you what an object is and where it is, so you can count and sort — but it deliberately
              ignores size to stay small enough for a microcontroller.
            </p>
          }
        />
        <Callout label="Three classes">Background, Fruit, Bug. FOMO will auto-add the background class for you.</Callout>
      </div>
    ),
  },
  {
    id: 'dataset-tips',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Data collection · rules of thumb',
    minutes: 2,
    kind: 'concept',
    content: (
      <div className="deck-slide">
        <Kicker>Collecting a good dataset</Kicker>
        <Title>About 50 photos that teach the model the real world</Title>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Vary everything">
            <BulletList items={[<>Angles, backgrounds and lighting</>, <>Different numbers of objects per frame</>, <>Objects of similar size, not overlapping</>]} />
          </Card>
          <Card title="One frame, many labels" tone="positive">
            <BulletList items={[<>No separate folders per class</>, <>Each image can hold fruits and bugs</>, <>A fixed camera keeps distances consistent</>]} />
          </Card>
        </div>
        <Callout label="Spec">Camera: QVGA 320×240, RGB565. Save frames with the browser Save button.</Callout>
      </div>
    ),
  },
  {
    id: 'capture-with-camerawebserver',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 1 · capture the dataset',
    minutes: 4,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 1 · capture the dataset</Kicker>
        <Title className="text-2xl md:text-3xl">Turn the XIAO into a Wi-Fi webcam</Title>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <CameraSimulator />
          <Checklist
            lang="en"
            id="tutorial-capture"
            title="Your move · 7 steps"
            steps={[
              {
                id: 'plug',
                label: 'Plug the XIAO into your computer with a USB cable',
                why: 'The same cable does two jobs at once: it powers the little board and lets your computer talk to it.',
              },
              {
                id: 'board',
                label: 'In Arduino IDE: pick the XIAO_ESP32S3 board and its port',
                detail: 'Tools > Board > esp32 > XIAO_ESP32S3, then Tools > Port.',
                why: 'Your computer needs to know which tiny brain it is talking to. Choosing the right board loads the matching drivers so code is written for the right chip.',
              },
              {
                id: 'stable',
                label: 'Install the stable ESP32 package (2.0.11)',
                detail: 'Boards Manager > search “esp32” > install 2.0.11. Skip the 3.x-alpha builds — they fail with the XIAO.',
                why: 'Alpha builds are unfinished test versions with known bugs. 2.0.11 is the polished release that is proven to work with the XIAO and Edge Impulse.',
              },
              {
                id: 'psram',
                label: 'Turn on PSRAM',
                detail: 'Tools > PSRAM > “OPI PSRAM”. The camera needs that extra memory.',
                why: 'PSRAM is extra memory soldered beside the main RAM. A camera frame is a big pile of numbers — without PSRAM the XIAO runs out of room and the picture goes black or crashes.',
              },
              {
                id: 'example',
                label: 'Open the CameraWebServer example',
                detail: 'File > Examples > ESP32 > Camera > CameraWebServer.',
                why: 'This ready-made program already knows how to take photos and serve them as a website. You only need to change two small things: the Wi-Fi name and the camera pins.',
              },
              {
                id: 'wifi',
                label: 'Type your Wi-Fi name and password in the code, then click Upload',
                detail: 'Lines 22–23: ssid and password. Wait for “Done uploading” in the green bar.',
                why: 'The XIAO has no keyboard and no screen. The Wi-Fi details are written into the code so the board can join your network and the browser can find it.',
              },
              {
                id: 'browser',
                label: 'Open the printed http:// address in your browser and click START STREAM',
                detail: 'Press the board’s reset button to see the address. Then use the simulator above: Save frame ≈ 50 times, changing the angle each time.',
                why: 'The camera becomes a tiny web server. Your browser does the heavy work: showing the live stream and saving each frame as a training photo.',
              },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    id: 'edge-impulse-setup',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 2 · the Studio project',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 2 · set up Edge Impulse</Kicker>
        <Title className="text-2xl md:text-3xl">Create the project that will learn to find objects</Title>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Checklist
            lang="en"
            id="tutorial-ei-setup"
            title="Studio setup"
            steps={[
              {
                id: 'login',
                label: 'Log in at studio.edgeimpulse.com (or create an account)',
                why: 'Your project lives on Edge Impulse’s servers — that is where the heavy training math runs, far too big for a laptop battery.',
              },
              {
                id: 'project',
                label: 'Start a new project',
                why: 'A project is a folder that holds your photos, your boxes, and your trained model together in one place.',
              },
              {
                id: 'labeling',
                label: 'Dashboard > Project info > Bounding boxes (object detection)',
                why: 'This switch tells the Studio you want detection: each object gets a box and a label, not just one label for the whole photo.',
              },
              {
                id: 'target',
                label: 'Target device: Espressif ESP-EYE — closest to the XIAO',
                why: 'Edge Impulse tunes the model for a specific chip family. ESP-EYE is the closest match to the XIAO — the same camera and chip family.',
              },
              {
                id: 'clone',
                label: 'Or clone the public project XIAO-ESP32S3-Sense-Object_Detection',
                why: 'A clone is a ready-made copy. Start from it if you want a working example to compare against, then swap in your own photos.',
              },
            ]}
          />
          <div className="flex flex-col gap-3">
            <Card title="Bounding boxes" tone="positive">
              The Studio now expects a box annotation per object — not just one label for the whole photo.
            </Card>
            <Callout label="Target device">ESP-EYE is the closest supported board to the XIAO ESP32S3 Sense — same camera chip family.</Callout>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'labeling-queue',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 3 · label the dataset',
    minutes: 5,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 3 · label the dataset</Kicker>
        <Title className="text-2xl md:text-3xl">Your turn: drag a box around each orange and frog</Title>
        <LabelingGame />
        <div className="grid grid-cols-3 gap-3">
          <Card title="Upload">47 unlabeled photos, all as training data</Card>
          <Card title="Assist" tone="positive">YOLOv5 misses our frogs — use object tracking between frames, then fix leftovers</Card>
          <Card title="Review">Edit any wrong box from the three-dot menu</Card>
        </div>
        <Why question="What makes a good box?">
          Draw it tight: a box that hugs the object teaches the model exactly what matters and leaves the background
          out. One box per object, no overlaps — and if the model is unsure, that is a clue for a better box, not a
          worse one.
        </Why>
      </div>
    ),
  },
  {
    id: 'balance-and-split',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 4 · rebalance + train/test split',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 4 · rebalance + train/test split</Kicker>
        <Title className="text-2xl md:text-3xl">Fix the imbalance, then lock away a test set</Title>
        <DatasetBalancer />
        <div className="grid gap-3 lg:grid-cols-2">
          <Why question="Why rebalance the classes?">
            If 85% of your photos are fruit, a lazy model scores 85% by saying “fruit” everywhere — without ever
            learning bugs. Balanced classes force it to actually look at both.
          </Why>
          <Why question="Why hide a test set?">
            You cannot grade a student on questions they have already seen — they would just memorize the answers. The
            hidden test photos are the real exam, so the score you get is honest.
          </Why>
        </div>
      </div>
    ),
  },
  {
    id: 'impulse-preprocessing',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 5 · design the impulse',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 5 · design the impulse</Kicker>
        <Title className="text-2xl md:text-3xl">Squash every frame to 96×96 and drop the color</Title>
        <PreprocessDemo />
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Callout label="In the Studio">Pre-processing: resize 320×240 → 96×96 (squash, no crop), then RGB → grayscale. Color depth: Grayscale, then Save parameters.</Callout>
            <Why question="Why 96×96 and grayscale?">
              Smaller images mean fewer numbers, so the XIAO works less. 96×96 gray is a sweet spot: small enough to
              run at ~7 fps, big enough to still see a fruit.
            </Why>
          </div>
          <div className="flex flex-col gap-3">
            <Callout label="Generate features">All samples become 96×96×1 tensors — 9,216 features each, ready to train.</Callout>
            <Why question="Why drop the color?">
              Color costs 3 numbers per pixel, gray costs 1. Shape matters more than color for finding objects, so
              dropping color saves 3× the work with almost no loss.
            </Why>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'train-fomo',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 6 · train FOMO',
    minutes: 4,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 6 · train FOMO</Kicker>
        <Title className="text-2xl md:text-3xl">FOMO MobileNetV2 0.35 — small, but smart</Title>
        <div className="grid gap-4 lg:grid-cols-2">
          <TrainingDemo />
          <DataAugmentation />
        </div>
        <div className="grid grid-cols-5 gap-3">
          <Stat value="60" label="epochs" />
          <Stat value="32" label="batch size" />
          <Stat value="0.001" label="learning rate" />
          <Stat value="85%" label="F1 score · test 83%" />
          <Stat value="12×12" label="grid · 96 / 8" />
        </div>
        <Callout label="Why F1, not accuracy">
          Detection is classification plus position — a mostly-empty scene can inflate plain accuracy. F1 balances
          precision and recall, and 20% of the data is held out for validation.
        </Callout>
      </div>
    ),
  },
  {
    id: 'live-classification',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 7 · test before you deploy',
    minutes: 3,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 7 · test before you deploy</Kicker>
        <Title className="text-2xl md:text-3xl">Try the model live, straight from your phone</Title>
        <Flow
          direction="horizontal"
          steps={[{ label: 'Connect a dev board' }, { label: 'Scan the QR code' }, { label: 'Point at objects', strong: true }, { label: 'Watch the prediction' }]}
        />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <PredictReveal
            lang="en"
            id="confidence-threshold"
            question="A blank wall scores 0.9 as “fruit”. What is the smartest move?"
            options={[{ label: 'Trust it — 90% is high' }, { label: 'Raise the confidence threshold' }, { label: 'Replace the camera' }]}
            correctIndex={1}
            explanation={
              <p>
                High confidence on an obviously empty scene is a false positive. A threshold around 0.8+ filters out
                the noise — no new camera needed.
              </p>
            }
          />
          <Callout label="Expect imperfection">
            False positives and false negatives are normal. The confidence threshold is your volume knob for trust.
          </Callout>
        </div>
        <Why question="What is a confidence threshold?">
          Confidence is the model’s “how sure am I?” score, from 0 to 1. The threshold is the bar it must clear before
          drawing a box. Set it to 0.8 and the model says “I will only show this when I am 80% sure” — exactly what
          stops flicker on blank walls.
        </Why>
      </div>
    ),
  },
  {
    id: 'deploy-arduino',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 8 · deploy with Arduino IDE',
    minutes: 5,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 8 · deploy with Arduino IDE</Kicker>
        <Title className="text-2xl md:text-3xl">Put the trained model on your XIAO</Title>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex min-w-0 flex-col gap-3">
            <CodeSnippet filename="esp32_camera.ino" badge="XIAO ESP32S3 Sense" code={PIN_CODE} />
            <Checklist
              lang="en"
              id="tutorial-deploy-arduino"
              title="Your move · 6 steps"
              steps={[
                {
                  id: 'build',
                  label: 'In Edge Impulse, build the library for Arduino',
                  detail: 'Deploy tab > Arduino Library > Quantized (int8) > EON Compiler > Build. This downloads a .zip file.',
                  why: '“Quantized” shrinks the model into small 8-bit numbers so it fits the XIAO’s memory. The EON Compiler then rewrites it as a tiny C++ library your Arduino can compile.',
                },
                {
                  id: 'zip',
                  label: 'Add the .zip to Arduino IDE',
                  detail: 'Sketch > Include Library > Add .ZIP Library, then choose the downloaded file.',
                  why: 'Arduino IDE installs helper code as .zip libraries. This one contains your trained model plus the code to run it.',
                },
                {
                  id: 'example',
                  label: 'Open the example program',
                  detail: 'File > Examples > your_project_name > esp32 > esp32_camera.',
                  why: 'The example is a complete program with one empty spot: the camera pins. Fill that spot in the next two steps and it is ready.',
                },
                {
                  id: 'pins',
                  label: 'Replace the camera pins with the XIAO block',
                  detail: 'Delete the default lines 32–75 and paste the XIAO block from above in their place.',
                  why: 'The example was written for a different board. Every board wires its camera differently, so we swap in the XIAO’s exact wiring map.',
                },
                {
                  id: 'wifi',
                  label: 'Type your Wi-Fi name and password at the top of the code',
                  why: 'Same trick as capture: the XIAO needs to know which network to join before it can send predictions to your computer.',
                },
                {
                  id: 'upload',
                  label: 'Click Upload, then open Serial Monitor',
                  detail: 'Tools > Serial Monitor. You should see Wi-Fi connecting, then boxes with class and confidence.',
                  why: 'Upload copies the program into the XIAO’s memory. The Serial Monitor is the XIAO’s way of talking back — it prints every object it detects.',
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Stat value="143 ms" label="per prediction" />
              <Stat value="~7 fps" label="live on the XIAO" />
            </div>
            <Card title="You should see" tone="positive">
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>fruit · 0.87 · x=120 y=90</p>
                <p>bug · 0.91 · x=230 y=180</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                One line per detected object — class, confidence, and position.
              </p>
            </Card>
            <Callout label="Did nothing happen?">
              Double-check the pins match the XIAO block exactly, and that PSRAM is on (Tools {'>'} PSRAM).
            </Callout>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'deploy-sensecraft',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Step 9 · deploy with SenseCraft',
    minutes: 4,
    kind: 'interaction',
    content: (
      <div className="deck-slide">
        <Kicker>Step 9 · deploy with SenseCraft</Kicker>
        <Title className="text-2xl md:text-3xl">See what the camera sees — no code needed</Title>
        <div className="grid gap-4 lg:grid-cols-2">
          <Checklist
            lang="en"
            id="tutorial-deploy-sensecraft"
            title="Your move · 5 steps"
            steps={[
              {
                id: 'tflite',
                label: 'Download the model file',
                detail: 'In Edge Impulse: Dashboard > block output > download the quantized .tflite.',
                why: 'The .tflite is your trained model in a universal format that many tools can read — the same brain, just packed for travel.',
              },
              {
                id: 'toolkit',
                label: 'Open the SenseCraft toolkit and plug in the XIAO',
                detail: 'Open the SenseCraft-Web-Toolkit page in Chrome and connect your XIAO with USB.',
                why: 'SenseCraft runs in your browser and talks to the XIAO over the USB cable — no programming at all on this route.',
              },
              {
                id: 'upload',
                label: 'Click Upload Custom AI Model',
                detail: 'Choose your .tflite file and give the model a name.',
                why: 'This copies the model into the XIAO’s memory. From now on the board can predict on its own, even without the computer.',
              },
              {
                id: 'labels',
                label: 'Type the labels in alphabetical order',
                detail: 'background, bug, fruit — SenseCraft reads them by number, not by name.',
                why: 'SenseCraft cannot read the label names from the file. It matches each label number to whatever you type, so the order must exactly match the model’s order.',
              },
              {
                id: 'tune',
                label: 'Move the Confidence and IoU sliders',
                detail: 'Start with Confidence 0.8. Raise it if boxes flicker on empty walls.',
                why: 'Confidence is how sure the model must be before it draws a box. Higher means fewer false alarms; the IoU slider merges boxes that overlap the same object.',
              },
            ]}
          />
          <div className="flex flex-col gap-3">
            <PredictReveal
              lang="en"
              id="labels-order"
              question="Which label order does SenseCraft expect?"
              options={[{ label: 'Alphabetical' }, { label: 'Training order' }, { label: 'Any order' }]}
              correctIndex={0}
              explanation={
                <p>
                  SenseCraft maps labels by index. Enter them alphabetically — background, bug, fruit — to match the
                  Edge Impulse model.
                </p>
              }
            />
            <Card title="The device log">
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <p>preprocess · 3 ms</p>
                <p>inference · 115 ms</p>
                <p>postprocess · 1 ms</p>
                <p className="text-foreground">box [x, y, w, h, score, class]</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                One box per detected centroid — the Confidence and IoU cursors filter out noise.
              </p>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tutorial-conclusion',
    chapter: TUTORIAL_CHAPTER,
    kicker: 'Mission accomplished',
    minutes: 3,
    kind: 'milestone',
    content: (
      <div className="deck-slide">
        <Kicker>Mission accomplished</Kicker>
        <Title>From 47 photos to a detector that counts on the chip</Title>
        <Flow
          direction="horizontal"
          steps={[{ label: 'Capture' }, { label: 'Label' }, { label: 'Train' }, { label: 'Quantize' }, { label: 'Deploy' }, { label: 'React', strong: true }]}
        />
        <div className="grid grid-cols-3 gap-3">
          <Card title="FOMO" tone="positive">Object detection, tracking and counting on microcontrollers — for the first time.</Card>
          <Card title="30×">Less energy and memory than MobileNet SSD / YOLOv5.</Card>
          <Card title="Real-time">~7 fps on the XIAO ESP32S3 Sense.</Card>
        </div>
        <Callout label="Last question for the class">
          What could a tiny camera that counts objects without the cloud do in your school, your farm or your
          factory?
        </Callout>
      </div>
    ),
  },
]
