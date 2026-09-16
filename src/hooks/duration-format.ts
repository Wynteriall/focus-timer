/**
 * iOS-clock-style continuous digit formatting (design.md §6).
 * A raw digit stream maps right-aligned onto ss → mm:ss → h:mm:ss.
 * Hours appear only when the entry needs them.
 */

export const MAX_DURATION_DIGITS = 6;

/** Longest representable duration: 99 h 59 m 59 s (6 digits). */
export const MAX_DURATION_SECONDS = 99 * 3600 + 59 * 60 + 59;

/** Seconds -> display string: `mm:ss`, or `h:mm:ss` when hours are needed. */
export function formatDuration(totalSeconds: number): string {
  const total = Math.max(0, Math.min(MAX_DURATION_SECONDS, Math.floor(totalSeconds)));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * Digit stream -> seconds. `5` -> 5, `1230` -> 750 (12:30),
 * `13000` -> 5400 (01:30:00). Empty or invalid input is 0.
 */
export function durationFromDigits(digits: string): number {
  const stream = digits.replace(/\D/g, '').slice(-MAX_DURATION_DIGITS);
  if (!stream) {
    return 0;
  }
  const widths = segmentWidths(stream.length);
  let seconds = 0;
  let index = 0;
  for (let i = 0; i < widths.length; i += 1) {
    const width = widths[i];
    const segment = stream.slice(index, index + width);
    index += width;
    seconds = seconds * 60 + Number(segment);
  }
  return Math.min(seconds, MAX_DURATION_SECONDS);
}

/** Digits for a duration, right-aligned, leading zeros stripped. */
export function digitsFromDuration(totalSeconds: number): string {
  const total = Math.max(0, Math.min(MAX_DURATION_SECONDS, Math.floor(totalSeconds)));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${hours > 0 ? String(hours) : ''}${mm}${ss}`.replace(/^0+(?=\d)/, '');
}

/** Grouping for `n` digits (design.md §6 examples; seconds always last two):
 *  3 -> [1,2] (`512` -> 05:12), 4 -> [2,2] (`1230` -> 12:30),
 *  5 -> [1,2,2] (`13000` -> 01:30:00), 6 -> [2,2,2] (`123456` -> 12:34:56). */
export function segmentWidths(count: number): number[] {
  if (count <= 0) return [0];
  if (count <= 2) return [count];
  if (count <= 4) return [count - 2, 2];
  if (count === 5) return [1, 2, 2];
  return [2, 2, 2];
}