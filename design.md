# Focus Timer — Design Spec

Single source of truth for the page redesign. Update this file **before**
changing styling code. Items marked `[TODO]` need your input; everything else
is the current baseline — keep it or replace it.

## 1. Vision Statement

[TODO] 2–3 sentences describing the feeling of the app.

Example: "A calm, premium focus timer. Opening it feels like clearing a desk —
one large readout, three quiet buttons, nothing else."

## 2. Design Principles

3–5 adjectives that act as decision filters. When a choice is unclear, these
decide. [TODO: replace with your own]

- Calm — nothing flashes, bounces, or demands attention
- Precise — tabular digits, aligned edges, deliberate spacing
- Spacious — generous whitespace; the timer is the hero
- Monochrome — color is reserved for state, not decoration

## 3. References & Anti-References

Concrete references anchor decisions better than adjectives.

- Love: [TODO, e.g. "Apple Clock timer — huge mono digits, soft gray buttons"]
- Love: [TODO]
- Avoid: [TODO, e.g. "gamified apps with streaks, mascots, bright greens"]

## 4. Design Tokens

Baseline = current `src/constants/theme.ts`. Replace values freely; keep the
token names so components don't need structural changes.

### Color (light / dark)

| Token              | Light   | Dark    |
| ------------------ | ------- | ------- |
| text               | #000000 | #ffffff |
| background         | #ffffff | #000000 |
| backgroundElement  | #F0F0F3 | #212225 |
| backgroundSelected | #E0E1E6 | #2E3135 |
| textSecondary      | #60646C | #B0B4BA |

[TODO: add an accent color if the new direction wants one]

### Typography

- Timer digits: mono, tabular-nums, 72px / 84px line height (hero element)
- Caption: system sans, small, textSecondary
- [TODO: adjust the scale if the vision calls for larger/bolder digits]

### Spacing & Shape

- Spacing scale: 2 / 4 / 8 / 16 / 24 / 32 / 64
- Gap between display and controls: 64
- Corner radius: [TODO — define if the new look uses rounded cards/buttons]
- Max content width: 800

## 5. Layout Spec

Baseline (current): single centered column —

1. Large mm:ss readout (hero element)
2. "remaining" caption beneath it
3. Row of three buttons: Start/Resume · Pause · Reset

[TODO: describe the new layout, e.g. "circular progress ring around the
digits, controls pinned to the bottom third"]

## 6. States

| State    | Display | Start/Resume | Pause    | Reset   |
| -------- | ------- | ------------ | -------- | ------- |
| Idle     | 05:00   | enabled      | disabled | enabled |
| Running  | counts  | disabled     | enabled  | enabled |
| Paused   | frozen  | enabled      | disabled | enabled |
| Finished | 00:00   | disabled     | disabled | enabled |

[TODO: should states look different? e.g. digits dim when paused, accent tint
while running, distinct finished treatment]

## 7. Motion & Interaction

Baseline: none (static UI, instant state changes).

[TODO: any transitions? e.g. button press opacity, digit crossfade, ring
animation. Constraints: no audio, no haptics, no notifications (V1 rules).]

## 8. Out of Scope

- No new features (duration picker, presets, session history)
- No audio, haptics, or push notifications
- No third-party UI/styling libraries without explicit approval