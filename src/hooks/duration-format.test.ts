import {
  MAX_DURATION_SECONDS,
  digitsFromDuration,
  durationFromDigits,
  formatDuration,
  segmentWidths,
} from '@/hooks/duration-format';

describe('duration-format', () => {
  it('formats mm:ss under an hour and h:mm:ss at or over it', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(750)).toBe('12:30');
    expect(formatDuration(3599)).toBe('59:59');
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(5400)).toBe('1:30:00');
  });

  it('formats the maximum 6-digit duration and clamps overflow', () => {
    expect(formatDuration(MAX_DURATION_SECONDS)).toBe('99:59:59');
    expect(formatDuration(999 * 3600)).toBe('99:59:59');
  });

  it('maps digit streams right-aligned (iOS clock style)', () => {
    expect(durationFromDigits('5')).toBe(5);
    expect(durationFromDigits('12')).toBe(12);
    expect(durationFromDigits('1230')).toBe(12 * 60 + 30);
    expect(durationFromDigits('13000')).toBe(90 * 60);
    expect(durationFromDigits('000005')).toBe(5);
  });

  it('returns 0 for empty or non-digit input', () => {
    expect(durationFromDigits('')).toBe(0);
    expect(durationFromDigits('abc')).toBe(0);
  });

  it('reverses a duration back into digits', () => {
    expect(digitsFromDuration(750)).toBe('1230');
    expect(digitsFromDuration(5400)).toBe('13000');
    expect(digitsFromDuration(5)).toBe('5');
    expect(digitsFromDuration(0)).toBe('0');
  });

  it('round-trips every digit width up to the cap', () => {
    for (let digits = 1; digits <= 6; digits += 1) {
      const stream = '1'.repeat(digits);
      const seconds = durationFromDigits(stream);
      expect(digitsFromDuration(seconds)).toBe(stream);
      expect(seconds).toBeLessThanOrEqual(MAX_DURATION_SECONDS);
    }
  });

  it('segments widths like an iOS clock', () => {
    expect(segmentWidths(0)).toEqual([0]);
    expect(segmentWidths(1)).toEqual([1]);
    expect(segmentWidths(2)).toEqual([2]);
    expect(segmentWidths(3)).toEqual([1, 2]);
    expect(segmentWidths(4)).toEqual([2, 2]);
    expect(segmentWidths(5)).toEqual([1, 2, 2]);
    expect(segmentWidths(6)).toEqual([2, 2, 2]);
  });
});