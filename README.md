# Focus Timer ⏳

A minimal countdown timer built with [Expo](https://expo.dev) — an on-screen
visual countdown with start, pause, and reset controls.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

Then open it in [Expo Go](https://expo.dev/go), an Android emulator, an iOS
simulator, or press `w` for the web version.

## Verify changes

```bash
npx tsc --noEmit   # type safety (strict mode)
npm test           # unit tests (jest-expo)
npx expo lint      # linting
```

## Project structure

```
src/
├── app/          # expo-router screens (layout only)
├── components/   # pure presentation
│   └── ui/       # reusable, theme-agnostic widgets
├── hooks/        # countdown logic and device hooks
└── constants/    # theme tokens
```

See [`memory-bank/systemPatterns.md`](memory-bank/systemPatterns.md) for the
full architecture and [`AGENTS.md`](AGENTS.md) for development rules.

