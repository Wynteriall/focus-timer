# Focus Timer — Agent Instructions

## Commands
- Start dev server: `npx expo start` (press `w` for web)
- Typecheck: `npx tsc --noEmit`
- Tests: `npm test` (single run), `npm run test:watch`
- Add packages: `npx expo install <package-name>`
- Lint: `npx expo lint`

## Strict Constraints
- Always use `npx expo install`. Never use raw `npm install` or `yarn`.
- Run `npx tsc --noEmit` to verify type safety. Never use the `any` type.
- Keep every file under 120 lines. Split any file that exceeds this limit.
- Do not install third-party libraries without explicit user approval.

## V1 Scope
On-screen visual countdown with start, pause, and reset buttons, plus a
type-in duration editor on the idle readout (automatic h/m/s formatting).
Prohibitions: no audio, no sound effects, no haptics, no push notifications.
Design source of truth: `design.md` (update it before changing styling).

## Project Knowledge
`memory-bank/` is the single source of truth for project knowledge
(scope, architecture, context, progress). Read it before starting a task and
keep it current after significant changes.

