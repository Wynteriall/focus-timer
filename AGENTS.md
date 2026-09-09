# Focus Timer — Agent Instructions

## Tech Stack
- Expo (React Native) with TypeScript
- expo-router, expo 57, react-native 0.86, react 19
- Strict TypeScript (extends `expo/tsconfig.base`, strict mode)
- Path aliases: `@/*` → `./src/*`, `@/assets/*` → `./assets/*`

## Commands
- Start dev server: `npx expo start`
- Typecheck: `npx tsc --noEmit`
- Add packages: `npx expo install <package-name>`
- Lint: `npx expo lint`

## Strict Constraints
- Always use `npx expo install`. Never use raw `npm install` or `yarn`.
- Run `npx tsc --noEmit` to verify type safety. Never use the `any` type.
- Keep every file under 120 lines. Split any file that exceeds this limit.
- Do not install third-party libraries without explicit user approval.

## V1 Scope & Prohibitions
- Scope: Build only an on-screen visual countdown with start, pause, and reset buttons.
- Prohibitions: No audio, no sound effects, no haptics, and no push notifications.
