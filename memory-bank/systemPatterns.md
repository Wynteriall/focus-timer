# Focus Timer — System Patterns

## Directory Structure

```
src/
├── app/               # expo-router screens (layout only)
│   ├── _layout.tsx    # Root layout (fonts, global.css, light-only theme)
│   └── index.tsx      # Countdown screen
├── components/
│   ├── background/    # Planned (slice 5): blobs, grain, cursor glow
│   ├── ui/            # Reusable, theme-agnostic widgets
│   │   ├── countdown-display.tsx
│   │   ├── countdown-controls.tsx
│   │   ├── text-button.tsx        # Planned (slice 3)
│   │   └── progress-bar.tsx       # Planned (slice 4)
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/
│   ├── duration-format.ts    # Pure digit <-> time formatting (tested)
│   ├── use-countdown.ts      # Countdown state + isFinished/setDuration
│   ├── use-duration-entry.ts # Idle type-in draft state
│   ├── use-digit-motion.ts   # Planned (slice 2): breathe/paused/finished
│   ├── use-idle-visibility.ts# Planned (slice 3): 3s auto-hide of controls
│   ├── blob-math.ts          # Planned (slice 5): pure blob math (tested)
│   ├── use-blob-field.ts     # Planned (slice 5): clock + lifespans
│   ├── use-pointer.ts        # Planned (slice 5): normalized pointer
│   ├── use-theme.ts
│   └── use-color-scheme.ts
└── constants/         # Theme tokens and config values
    ├── theme.ts       # Design tokens (color, type, spacing, max width)
    └── motion.ts      # Motion + BackgroundParams (design.md §8)
```

## Boundaries

- **Screens** (`src/app/`): Compose layout from hooks and components. No timer
  logic here.
- **Hooks** (`src/hooks/`): Own all state and countdown logic. `useCountdown`
  exports `{ remaining, isRunning, isFinished, durationSeconds, start, pause,
  reset, setDuration }`; `useDurationEntry` owns the idle type-in draft.
- **Components** (`src/components/`): Pure presentation. Receive props, render
  UI. No side effects.

## Key Technical Decisions
- Single screen, no tabs (V1 is one countdown screen)
- Countdown driven by `useCountdown` hook; UI components are stateless
- Targeted TDD on logic (hooks and pure helper modules); light render tests for
  presentation, plus a manual visual check against `design-prototype/`
- Pure logic lives in plain modules under `src/hooks/` (precedent:
  `duration-format.ts`) so it can be unit-tested without rendering
- Motion uses React Native core `Animated` (works in RNW and jest);
  reanimated 4 is installed but intentionally unused so far
- Light-only theme for V1: `Colors.dark` aliases `light` (design.md §4)
- Web renders through react-native-web, which does **not** support `filter`,
  `mixBlendMode` or `experimental_backgroundImage`; avoid those props for web

## Rules

- Every file must stay under 120 lines. Split before hitting the limit.
- One responsibility per file. If a hook grows, extract helpers into `src/hooks/`.
- Components under `src/components/ui/` must be reusable across screens.
