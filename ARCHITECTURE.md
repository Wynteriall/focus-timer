# Focus Timer — Architecture

## Directory Structure

```
src/
├── app/               # expo-router screens (layout only)
│   ├── _layout.tsx
│   └── index.tsx      # Countdown screen
├── components/        # Reusable UI primitives
│   └── ui/            # Generic, theme-agnostic widgets
├── hooks/             # Countdown logic and device hooks
│   └── use-countdown.ts
└── constants/         # Theme tokens and config values
```

## Boundaries

- **Screens** (`src/app/`): Compose layout from hooks and components. No timer logic here.
- **Hooks** (`src/hooks/`): Own all state and countdown logic. Export `{ remaining, isRunning, start, pause, reset }`.
- **Components** (`src/components/`): Pure presentation. Receive props, render UI. No side effects.

## Rules

- Every file must stay under 120 lines. Split before hitting the limit.
- One responsibility per file. If a hook grows, extract helpers into `src/hooks/`.
- Components under `src/components/ui/` must be reusable across screens.
