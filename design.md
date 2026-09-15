# Focus Timer — Design Spec

Single source of truth for the redesign. Update this file **before** changing
styling code. Background/cursor values below are **tuned by the user** in the
prototype (`design-prototype/`) and locked in.

## 1. Vision Statement

A graceful, living countdown that feels like a quiet clearing in nature. One
huge serif readout breathes above a slow green-and-white liquid bloom; the
interface itself is nearly invisible — text controls fade away until needed.

## 2. Design Principles

- Graceful — every change is a soft transition, never a snap
- Calming — slow rhythms, soft edges, nothing demands attention
- Organic — imperfect, flowing shapes; nothing perfectly geometric
- Airy — generous whitespace; the digits and the bloom are the only subjects
- Natural — greens and whites, like light through leaves

## 3. References & Anti-References

- No external references; the tunable prototype (`design-prototype/`) is the
  living reference for the background and cursor.
- Avoid: gamified timers, streaks, saturated brights, hard shadows.

## 4. Design Tokens

Light-only for V1. A dark "dusk" theme is a future version.

### Color (baseline — tune further only if the mood shifts)

| Token      | Baseline | Role                             |
| ---------- | -------- | -------------------------------- |
| background | #FAFAF7  | warm paper white                 |
| text       | #22301F  | deep green-charcoal              |
| accent     | #5F8465  | sage green (bar, glows, hover)   |
| accentSoft | #DCE9DC  | pale mint (blob edges, tints)    |
| white      | #FFFFFF  | blob highlight                   |

### Typography

- Timer digits: **Cormorant Garamond** (free Google Font). Requires adding
  `@expo-google-fonts/cormorant-garamond` — pending explicit user approval.
- Digits: weight 300, baseline 160px on web (scales ~22vw, cap 320px)
- Controls: small quiet sans, uppercase, wide letter-spacing
- No caption text anywhere on the page

### Spacing & Shape

- Corner radius: none — no cards or boxes; text sits directly on the page
- Max content width: 800
- Progress bar: top, 24px padding, 3px thick, tapered to points at both ends

## 5. Layout Spec

Single centered column, full viewport:

1. Top: tapered progress bar, 24px from edges
2. Center: huge `mm:ss` (→ `h:mm:ss` when hours are needed) serif readout —
   the only hero; directly typeable in Idle
3. Below: one quiet row of text buttons — Begin/Resume · Pause · Reset
4. Nothing else

## 6. Time Input (scope updated in `projectbrief.md` / `AGENTS.md`)

- Idle digits are directly editable: click/tap the readout, type a duration
- Continuous digit entry, right-aligned (iOS clock style):
  `5` → 00:05 · `12` → 00:12 · `1230` → 12:30 · `13000` → 01:30:00
- Hours appear only when the entry needs them; Backspace deletes last digit
- Selected/editing digits grow (~1.1×) around the edited group
- While typing: instant, no animation. On commit (Enter/blur/Start): digits
  rise from below ~0.3em and fade in over ~400ms
- Editable only in Idle; Running/Paused/Finished readouts are static

## 7. States

| State    | Digits                        | Blob                  | Bar              |
| -------- | ----------------------------- | --------------------- | ---------------- |
| Idle     | full presence, typeable       | living drift          | full, visible    |
| Running  | breathe: 8% scale over a 12s cycle | living drift     | depletes         |
| Paused   | soften to ~70% opacity        | stills (nearly frozen)| freezes          |
| Finished | one glow pulse, settles ~5% larger, then rest | one slow deep swell, then very still | fades out quietly |

- Controls in every state: hidden until mouse/touch input (see §8)
- Bar depletes symmetrically, shrinking from both ends toward the center

## 8. Motion & Interaction

### Background — living blobs (tuned values locked)

- 5 liquid blobs (slider range 1–5), each an organic outline perturbed by two
  layered sines; radial green→white gradient fill; 55px gaussian blur
- **Each blob is autonomous and unique:** random anchor point, own drift
  orbit (slow lissajous wander), own shape frequencies/amplitudes, own size
  (0.55–1.6× of the 0.44 size scalar), own opacity depth (0.3–1.0, also
  driving parallax depth), and one of 3 green depth tones
- **Lifespan ~60s** (50–70s): blobs fade in ~8s, live, fade out ~12s, and
  are replaced by a freshly spawned blob — the background never repeats
- Morph speed 1.5 (reference scale); paused state slows global time to ~3%

### Atmosphere (tuned values locked)

- Grain: full-viewport film grain, intensity 0.03, subtle live flicker
- Parallax: blobs shift with cursor by depth, strength 60px (max)
- Cursor glow: soft green radial glow follows cursor — 400px, intensity 0.5
- Buttons: borderless text; hover blooms a soft glowing underline (~200ms);
  disabled = 40% opacity, never removed from layout
- Auto-hide: controls fade out after ~3s without mouse movement; fade in on
  any movement. Touch: tap toggles, then auto-hide
- All motion eased and slow (≥200ms); nothing bounces
- Prohibited (V1): audio, haptics, notifications

## 9. Out of Scope

- Dark theme (future version)
- Presets, session history, alarms
- Third-party UI/styling libraries without explicit approval (the font
  package above is the single requested exception, pending approval)