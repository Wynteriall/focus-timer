import { useCallback, useEffect, useState } from 'react';

export type Countdown = {
  remaining: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

/**
 * Owns all countdown state and logic.
 * - `start` begins (or resumes) the countdown; no-op while running or finished.
 * - `pause` freezes the countdown; no-op when not running.
 * - `reset` restores the initial duration and stops the countdown.
 */
export function useCountdown(durationSeconds: number): Countdown {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

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
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  return { remaining, isRunning, start, pause, reset };
}
