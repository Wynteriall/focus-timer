# Focus Timer — Redesign Plan (design.md implementation)

Spec of record: `design.md`. Reference implementation: `design-prototype/`
(`blob.js` = background engine, `styles.css` = layout / bar / controls geometry).

## Slice Order and Verification

Each slice: `npx tsc --noEmit` + `npm test`; visual check via `npx expo start`
(press `w`) against the prototype. Every file stays under 120 lines.

| # | Slice | Deliverables | Verify |
| - | ----- | ------------ | ------ |
| 0 | Docs checkpoint | memory bank updated; slice 1 committed | tsc, tests |
| 1 | Font + theme plumbing | `_layout.tsx` (`useFonts`, `global.css`, light-only), `app.json` light, `jest.setup.ts` font mock | tsc, tests, web boot |
| 2 | Readout | `countdown-display.tsx`, `use-digit-motion.ts`, key entry wiring; drop local `formatTime` | tsc, tests, visual |
| 3 | Controls | `text-button.tsx`, `countdown-controls.tsx`, `use-idle-visibility.ts` | tsc, tests, visual |
| 4 | Progress bar | `progress-bar.tsx` + tested taper geometry helper | tsc, tests, visual |
| 5 | Background | `blob-math.ts`, `use-blob-field.ts`, `use-pointer.ts`, `components/background/*` | tsc, tests, visual |
| 6 | Screen assembly | `src/app/index.tsx` wiring `useCountdown` + `useDurationEntry` | tsc, tests, visual |
| 7 | Final pass | full verification, docs, commit | `npx expo export -p web` + manual |

## File Map (planned)

```text
src/
├── app/
│   ├── _layout.tsx                # fonts, global.css, light-only theme
│   └── index.tsx                  # bar + readout + controls (design §5)
├── components/
│   ├── background/                # slice 5
│   │   ├── liquid-background.tsx  # composes the layers below
│   │   ├── blob-field.tsx         # 14 drifting shapes
│   │   ├── grain.tsx              # tiled noise at 0.035 opacity
│   │   └── cursor-glow.tsx        # 400px soft green radial glow
│   ├── ui/
│   │   ├── countdown-display.tsx  # serif digits, state motion, editing
│   │   ├── text-button.tsx        # borderless text button (replaces button.tsx)
│   │   ├── countdown-controls.tsx # Begin/Resume · Pause · Reset + auto-hide
│   │   └── progress-bar.tsx       # tapered, symmetric depletion
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/
│   ├── duration-format.ts         # done (slice 1) — pure, tested
│   ├── use-duration-entry.ts      # done (slice 1)
│   ├── use-countdown.ts           # done (slice 1) — +isFinished, setDuration
│   ├── use-digit-motion.ts        # slice 2 — breathe / paused / finished / commit
│   ├── use-idle-visibility.ts     # slice 3 — 3s auto-hide of controls
│   ├── blob-math.ts               # slice 5 — pure spawn/drift/envelope math
│   ├── use-blob-field.ts          # slice 5 — clock, lifespans, respawn
│   ├── use-pointer.ts             # slice 5 — normalized pointer (parallax/glow)
│   ├── use-theme.ts
│   └── use-color-scheme.ts
└── constants/
    ├── theme.ts                   # design tokens (color, type, spacing, width)
    └── motion.ts                  # Motion + BackgroundParams (design §8)
```

## Implementation Notes

- Pure logic lives in plain modules under `src/hooks/` (precedent:
  `duration-format.ts`) so it can be unit-tested without rendering
- Motion uses RN core `Animated`; `useNativeDriver: true` for transforms on
  native, JS driver acceptable on web
- Tapered bar: RN/RNW have no `clip-path`, so build the spindle from two
  transparent-border triangles meeting at the centre, with tone steps faking
  the gradient (`accent` → `accentSoft` → `accent`)
- Grain: generate a small noise tile (PNG asset) and tile it with
  `Image resizeMode="repeat"` at opacity 0.035; flicker by swapping tiles
- Auto-hide and parallax both need pointer events (`onPointerMove`,
  `onPointerDown`); verify they fire on web and on touch
- Jest: mock `expo-font` `useFonts` to `[true, null]`; keep component tests to
  labels, text and accessibility states rather than animated values

## Open Decision (blocks slice 5)

Which renderer for the blobs, given react-native-web 0.21 cannot do `filter`,
`mixBlendMode` or radial-gradient style props:

1. `react-native-svg` — organic sine-perturbed paths, `RadialGradient` fills,
   `feTurbulence` grain; real DOM SVG on web, native views elsewhere (no WASM)
2. `@shopify/react-native-skia` — closest 1:1 port of `design-prototype/blob.js`;
   heaviest install, needs CanvasKit on web and jest mocks
3. No new dependencies — layered `View`s: ellipses via `borderRadius`, opacity
   and drift; accurate drift but geometric shapes and no per-blob blur

Option 1 or 2 requires explicit user approval before `npx expo install`.
