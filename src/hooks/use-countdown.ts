import { useCallback, useEffect, useState } from 'react';

import { MAX_DURATION_SECONDS } from '@/hooks/duration-format';

export type Countdown = {
  remaining: number;
  isRunning: boolean;
  /** True once the countdown has reached zero (cleared by reset/edit). */
  isFinished: boolean;
  /** Seconds the countdown resets to (updated by `setDuration` in idle). */
  durationSeconds: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  /** Commit a new duration while idle (type-in editor); no-op when running. */
  setDuration: (seconds: number) => void;
};

/**
 * Owns all countdown state and logic.
 * - `start` begins (or resumes) the countdown; no-op while running or finished.
 * - `pause` freezes the countdown; no-op when not running.
 * - `reset` restores the current duration and stops the countdown.
 * - `setDuration` re-targets the countdown while idle.
 */
export function useCountdown(durationSeconds: number): Countdown {
  const [duration, setDurationState] = useState(durationSeconds);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const interval = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && remaining === 0) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [isRunning, remaining]);

  const start = useCallback(() => {
    if (remaining > 0) {
      setIsRunning(true);
    }
  }, [remaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(duration);
  }, [duration]);

  const setDuration = useCallback((seconds: number) => {
    setIsRunning((running) => {
      if (running) {
        return true;
      }
      const target = Math.max(0, Math.min(MAX_DURATION_SECONDS, Math.floor(seconds)));
      setDurationState(target);
      setRemaining(target);
      setIsFinished(false);
      return false;
    });
  }, []);

  return {
    remaining,
    isRunning,
    isFinished,
    durationSeconds: duration,
    start,
    pause,
    reset,
    setDuration,
  };
}
