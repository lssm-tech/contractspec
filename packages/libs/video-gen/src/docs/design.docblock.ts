import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const designDocBlocks: DocBlock[] = [
  {
    id: 'docs.video-gen.design',
    title: 'Video Design System',
    summary:
      'Design tokens, motion primitives, typography scale, and layout system optimized for programmatic video.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/video-gen/design',
    tags: ['video', 'design-tokens', 'motion', 'typography', 'layout'],
    owners: ['@contractspec/lib.video-gen'],
    body: `# Video Design System

The design layer bridges \`@contractspec/lib.design-system\` brand tokens with video-specific extensions for motion, typography, and spatial layout. All values are optimized for 1920x1080 (landscape) and scale proportionally for other formats.

\`\`\`ts
import {
  defaultVideoTheme,
  videoEasing,
  videoDurations,
  videoTypography,
  videoSafeZone,
  scaleSafeZone,
} from "@contractspec/lib.video-gen/design";
\`\`\`

## Tokens

### Brand Bridge

\`VideoThemeTokens\` extends the design-system \`ThemeTokens\` with a \`video\` namespace for video-specific colors:

\`\`\`ts
import { defaultVideoTheme } from "@contractspec/lib.video-gen/design/tokens";

// Brand tokens (from @contractspec/lib.design-system)
defaultVideoTheme.colors.primary;    // brand primary
defaultVideoTheme.colors.accent;     // brand accent

// Video-specific extensions
defaultVideoTheme.video.canvasBackground;    // frame background
defaultVideoTheme.video.codeBackground;      // "#1e1e2e"
defaultVideoTheme.video.terminalBackground;  // "#0d1117"
defaultVideoTheme.video.terminalForeground;  // "#c9d1d9"
defaultVideoTheme.video.highlight;           // accent color
defaultVideoTheme.video.gradientStart;       // primary
defaultVideoTheme.video.gradientEnd;         // accent
\`\`\`

> Do not duplicate brand color values. Import and extend from \`@contractspec/lib.design-system\`.

## Motion

### Easing Functions

Pre-configured easing curves for use with Remotion's \`interpolate()\`:

| Key | Easing | Use Case |
|-----|--------|----------|
| \`entrance\` | \`Easing.out(Easing.exp)\` | Objects appearing |
| \`exit\` | \`Easing.in(Easing.exp)\` | Objects disappearing |
| \`emphasis\` | \`Easing.out(Easing.back(1.4))\` | Drawing attention, bounce |
| \`linear\` | \`Easing.linear\` | Progress bars, typing |
| \`gentle\` | \`Easing.bezier(0.25, 0.1, 0.25, 1)\` | Subtle movements |
| \`spring\` | \`Easing.out(Easing.back(1.7))\` | Playful movements |

\`\`\`ts
import { interpolate } from "remotion";
import { videoEasing } from "@contractspec/lib.video-gen/design/motion";

const opacity = interpolate(frame, [0, 15], [0, 1], {
  easing: videoEasing.entrance,
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
\`\`\`

### Durations (frames at 30fps)

| Key | Frames | Seconds | Use Case |
|-----|--------|---------|----------|
| \`sceneTransition\` | 20 | 0.67s | Between scenes |
| \`textEntrance\` | 15 | 0.5s | Text slide-in |
| \`textExit\` | 12 | 0.4s | Text slide-out |
| \`codeTypingPerChar\` | 2 | 0.07s | Code typing speed |
| \`sectionPause\` | 30 | 1.0s | Pause after concept |
| \`emphasisPause\` | 15 | 0.5s | Brief emphasis |
| \`brandReveal\` | 25 | 0.83s | Logo/watermark |
| \`minScene\` | 60 | 2.0s | Minimum scene length |
| \`shortScene\` | 60 | 2.0s | Short scene |
| \`mediumScene\` | 120 | 4.0s | Medium scene |
| \`longScene\` | 240 | 8.0s | Long scene |

### Transition Presets

\`\`\`ts
import { videoTransitions } from "@contractspec/lib.video-gen/design/motion";

// { type: "fade", durationInFrames: 20 }
videoTransitions.fade;

// { type: "slide-left", durationInFrames: 20 }
videoTransitions.slideLeft;
\`\`\`

## Typography

### Type Scale (1920x1080 baseline)

| Key | Size | Weight | Use Case |
|-----|------|--------|----------|
| \`title\` | 72px | 700 | Main title |
| \`heading\` | 56px | 600 | Section heading |
| \`subheading\` | 40px | 500 | Subheading |
| \`body\` | 32px | 400 | Body text |
| \`code\` | 28px | 400 | Monospace code |
| \`caption\` | 24px | 400 | Small caption |
| \`label\` | 20px | 600 | Badge / label |

### Scaling for Other Formats

Use \`scaleTypography()\` to proportionally scale for non-landscape formats:

\`\`\`ts
import {
  videoTypography,
  scaleTypography,
} from "@contractspec/lib.video-gen/design/typography";

// Scale heading for 1080x1080 (square)
const squareHeading = scaleTypography(videoTypography.heading, 1080);
// -> fontSize: 32, lineHeight: 1.2, fontWeight: 600
\`\`\`

## Layouts

### Safe Zones

Content-safe padding for text within video frames (1920x1080 baseline):

\`\`\`ts
import {
  videoSafeZone,
  scaleSafeZone,
} from "@contractspec/lib.video-gen/design/layouts";

videoSafeZone.horizontal;   // 120px
videoSafeZone.vertical;     // 80px
videoSafeZone.contentWidth;  // 1680px
videoSafeZone.contentHeight; // 920px

// Scale for portrait (1080x1920)
const portrait = scaleSafeZone({ type: "portrait", width: 1080, height: 1920 });
\`\`\`

### Standard Positions

\`\`\`ts
import { videoPositions } from "@contractspec/lib.video-gen/design/layouts";

videoPositions.center;       // { x: 960, y: 540 }
videoPositions.topLeft;      // { x: 120, y: 80 }
videoPositions.bottomRight;  // { x: 1800, y: 1000 } -- logos, watermarks
videoPositions.bottomCenter; // { x: 960, y: 960 } -- captions
\`\`\`

### Format Variants

\`\`\`ts
import {
  VIDEO_FORMATS,
  getAllFormatVariants,
  DEFAULT_FPS,
} from "@contractspec/lib.video-gen/design/layouts";

VIDEO_FORMATS.landscape; // { type: "landscape", width: 1920, height: 1080 }
VIDEO_FORMATS.portrait;  // { type: "portrait",  width: 1080, height: 1920 }
VIDEO_FORMATS.square;    // { type: "square",    width: 1080, height: 1080 }

getAllFormatVariants();   // [landscape, square, portrait]
DEFAULT_FPS;             // 30
\`\`\`
`,
  },
];

registerDocBlocks(designDocBlocks);
