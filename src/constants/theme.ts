/**
 * Design tokens from `design.md` §4 (light-only for V1 — a dark "dusk"
 * theme is a future version). This file is the single source of truth for
 * styling constants; update `design.md` before changing values here.
 */

import { Platform } from 'react-native';

const lightColors = {
  /** warm paper white — page background */
  background: '#FAFAF7',
  /** deep green-charcoal — digits, text */
  text: '#22301F',
  /** sage green — progress bar, glow accents */
  accent: '#5F8465',
  /** pale mint — soft tints */
  accentSoft: '#DCE9DC',
  /** blob highlight */
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#DCE9DC',
  textSecondary: '#22301F',
} as const;

export const Colors = {
  light: lightColors,
  // Light-only V1: dark keys exist only to satisfy the ThemeColor type.
  dark: lightColors,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Timer digits use Cormorant Garamond weight 300, loaded via `useFonts`
 * in the root layout with family name `CormorantGaramond_300Light`.
 * Controls stay on the quiet system sans.
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** Family name registered by expo-font in `src/app/_layout.tsx`. */
export const DigitFont = 'CormorantGaramond_300Light' as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;
