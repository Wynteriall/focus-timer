import { useCallback, useState } from 'react';

import {
  MAX_DURATION_DIGITS,
  digitsFromDuration,
  durationFromDigits,
} from '@/hooks/duration-format';

export type DurationEntry = {
  /** Raw digit stream currently being typed (idle editing only). */
  digits: string;
  /** Seconds represented by the current draft (0 when empty). */
  draftSeconds: number;
  /** True while the stream has been touched and not yet committed. */
  isDirty: boolean;
  typeDigit: (digit: string) => void;
  backspace: () => void;
  clear: () => void;
  /** Load the current duration as the draft (entering edit mode). */
  beginEdit: (seconds: number) => void;
};

/**
 * Owns the idle type-in draft: a continuous right-aligned digit stream.
 * Pure state; formatting lives in `duration-format.ts`, commit semantics
 * live in the screen (`useCountdown.setDuration`).
 */
export function useDurationEntry(): DurationEntry {
  const [digits, setDigits] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const typeDigit = useCallback((digit: string) => {
    if (!/^[0-9]$/.test(digit)) {
      return;
    }
    setIsDirty(true);
    setDigits((stream) => {
      const next = (stream + digit).replace(/^0+/, '') || '0';
      return next.slice(-MAX_DURATION_DIGITS);
    });
  }, []);

  const backspace = useCallback(() => {
    setIsDirty(true);
    setDigits((stream) => stream.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setIsDirty(true);
    setDigits('');
  }, []);

  const beginEdit = useCallback((seconds: number) => {
    setDigits(digitsFromDuration(seconds));
    setIsDirty(false);
  }, []);

  return {
    digits,
    draftSeconds: durationFromDigits(digits),
    isDirty,
    typeDigit,
    backspace,
    clear,
    beginEdit,
  };
}