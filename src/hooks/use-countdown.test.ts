import { act, renderHook } from '@testing-library/react-native';

import { MAX_DURATION_SECONDS } from '@/hooks/duration-format';

import { useCountdown } from '@/hooks/use-countdown';

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const advanceSeconds = async (seconds: number): Promise<void> => {
    await act(async () => {
      jest.advanceTimersByTime(seconds * 1000);
    });
  };

  const invoke = async (action: () => void): Promise<void> => {
    await act(async () => {
      action();
    });
  };

  it('starts paused at the initial duration', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    expect(result.current.remaining).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it('counts down once per second while running', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(3);

    expect(result.current.remaining).toBe(57);
    expect(result.current.isRunning).toBe(true);
  });

  it('keeps counting when start is called while running', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(2);
    await invoke(() => result.current.start());
    await advanceSeconds(2);

    expect(result.current.remaining).toBe(56);
  });

  it('pauses and holds the remaining time', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(3);
    await invoke(() => result.current.pause());
    await advanceSeconds(5);

    expect(result.current.isRunning).toBe(false);
    expect(result.current.remaining).toBe(57);
  });

  it('resumes from the paused time', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(3);
    await invoke(() => result.current.pause());
    await invoke(() => result.current.start());
    await advanceSeconds(1);

    expect(result.current.remaining).toBe(56);
    expect(result.current.isRunning).toBe(true);
  });

  it('reset restores the initial duration and stops the countdown', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(10);
    await invoke(() => result.current.reset());

    expect(result.current.remaining).toBe(60);
    expect(result.current.isRunning).toBe(false);

    await advanceSeconds(2);
    expect(result.current.remaining).toBe(60);
  });

  it('stops at zero and never goes negative', async () => {
    const { result } = await renderHook(() => useCountdown(3));

    await invoke(() => result.current.start());
    await advanceSeconds(10);

    expect(result.current.remaining).toBe(0);
    expect(result.current.isRunning).toBe(false);

    await advanceSeconds(2);
    expect(result.current.remaining).toBe(0);
  });

  it('start is a no-op once the countdown has finished', async () => {
    const { result } = await renderHook(() => useCountdown(1));

    await invoke(() => result.current.start());
    await advanceSeconds(2);
    await invoke(() => result.current.start());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.remaining).toBe(0);
  });

  it('pause is a no-op when the countdown is not running', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.pause());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.remaining).toBe(60);
  });

  it('setDuration re-targets the idle countdown and resets remaining', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(3);
    await invoke(() => result.current.pause());
    await invoke(() => result.current.setDuration(90));

    expect(result.current.durationSeconds).toBe(90);
    expect(result.current.remaining).toBe(90);
    expect(result.current.isRunning).toBe(false);
  });

  it('setDuration is a no-op while running', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(3);
    await invoke(() => result.current.setDuration(120));
    await advanceSeconds(1);

    expect(result.current.durationSeconds).toBe(60);
    expect(result.current.remaining).toBe(56);
    expect(result.current.isRunning).toBe(true);
  });

  it('reset restores the edited duration rather than the initial prop', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.setDuration(15));
    await invoke(() => result.current.start());
    await advanceSeconds(5);
    await invoke(() => result.current.reset());

    expect(result.current.remaining).toBe(15);
    expect(result.current.isRunning).toBe(false);
  });

  it('flags finished at zero and clears it on reset', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.setDuration(2));
    await invoke(() => result.current.start());
    await advanceSeconds(3);

    expect(result.current.isFinished).toBe(true);
    expect(result.current.isRunning).toBe(false);

    await invoke(() => result.current.reset());

    expect(result.current.isFinished).toBe(false);
    expect(result.current.remaining).toBe(2);
  });

  it('setDuration clears a finished countdown', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.start());
    await advanceSeconds(61);
    expect(result.current.isFinished).toBe(true);

    await invoke(() => result.current.setDuration(45));

    expect(result.current.isFinished).toBe(false);
    expect(result.current.remaining).toBe(45);
  });

  it('setDuration floors and clamps to the entry cap', async () => {
    const { result } = await renderHook(() => useCountdown(60));

    await invoke(() => result.current.setDuration(10.9));
    expect(result.current.remaining).toBe(10);

    await invoke(() => result.current.setDuration(999999));
    expect(result.current.durationSeconds).toBe(MAX_DURATION_SECONDS);

    await invoke(() => result.current.setDuration(-5));
    expect(result.current.remaining).toBe(0);
  });
});
