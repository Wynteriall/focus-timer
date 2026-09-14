# Focus Timer — Product Context

## Why This Project Exists
A distraction-free focus timer. The user starts a session, the screen counts
down, and they can pause or reset as needed. V1 is deliberately tiny: the value
is in shipping a correct, reliable countdown, not in features.

## Problems It Solves
- A dedicated, minimal countdown with no clutter
- Clear visual feedback of remaining time at a glance

## How It Should Work
1. Screen shows the initial countdown duration
2. Pressing Start begins the countdown
3. Pressing Pause freezes the countdown; pressing Start (or Resume) continues
   from the same point
4. Pressing Reset restores the initial duration and stops the countdown
5. When the countdown reaches zero, it stops (no repeat, no alarm in V1)

## UX Goals
- Readout must be legible at a glance (large monospaced-style digits)
- Controls are obvious and reachable with a thumb
- Follows system light/dark theme
