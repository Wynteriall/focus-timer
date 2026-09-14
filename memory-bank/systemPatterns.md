# Focus Timer — System Patterns

## Directory Structure

```
src/
├── app/               # expo-router screens (layout only)
│   ├── _layout.tsx    # Root layout (ThemeProvider + Stack)
│   └── index.tsx      # Countdown screen
├── components/
│   ├── ui/            # Reusable, theme-agnostic widgets
│   │   ├── countdown-display.tsx
│   │   └── countdown-controls.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/
│   ├── use-countdown.ts  # All countdown state/logic
│   ├── use-theme.ts
│   └── use-color-scheme.ts
└── constants/         # Theme tokens and config values
    └── theme.ts
```

## Boundaries

- **Screens** (`src/app/`): Compose layout from hooks and components. No timer
  logic here.
- **Hooks** (`src/hooks/`): Own all state and countdown logic. `useCountdown`
  exports `{ remaining, isRunning, start, pause, reset }`.
- **Components** (`src/components/`): Pure presentation. Receive props, render
  UI. No side effects.

## Key Technical Decisions
- Single screen, no tabs (V1 is one countdown screen)
- Countdown driven by `useCountdown` hook; UI components are stateless
- Targeted TDD on the hook (jest fake timers); manual smoke test for the screen
- Theme via existing `useTheme()` + `ThemedText`/`ThemedView` primitives

## Rules

- Every file must stay under 120 lines. Split before hitting the limit.
- One responsibility per file. If a hook grows, extract helpers into `src/hooks/`.
- Components under `src/components/ui/` must be reusable across screens.
