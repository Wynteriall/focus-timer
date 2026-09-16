import { act, renderHook } from '@testing-library/react-native';

import { useDurationEntry } from '@/hooks/use-duration-entry';

describe('useDurationEntry', () => {
  const typeAll = async (
    result: { current: ReturnType<typeof useDurationEntry> },
    digits: string,
  ): Promise<void> => {
    for (const digit of digits) {
      await act(async () => {
        result.current.typeDigit(digit);
      });
    }
  };

  it('starts with an empty, clean draft', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    expect(result.current.digits).toBe('');
    expect(result.current.draftSeconds).toBe(0);
    expect(result.current.isDirty).toBe(false);
  });

  it('maps a continuous digit stream right-aligned onto the duration', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, '5');
    expect(result.current.draftSeconds).toBe(5);
    expect(result.current.digits).toBe('5');

    await typeAll(result, '12');
    expect(result.current.draftSeconds).toBe(5 * 60 + 12);
    expect(result.current.digits).toBe('512');
  });

  it('builds 12:30 from `1230` and 01:30:00 from `13000`', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, '1230');
    expect(result.current.draftSeconds).toBe(12 * 60 + 30);

    await act(async () => {
      result.current.clear();
    });
    await typeAll(result, '13000');
    expect(result.current.draftSeconds).toBe(90 * 60);
  });

  it('caps the stream at six digits and collapses leading zeros', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, '1234567');
    expect(result.current.digits).toBe('234567');

    await act(async () => {
      result.current.clear();
    });
    await typeAll(result, '007');
    expect(result.current.digits).toBe('7');
    expect(result.current.draftSeconds).toBe(7);
  });

  it('ignores non-digit input', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, 'a1b2');
    expect(result.current.digits).toBe('12');
  });

  it('backspace deletes the last digit', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, '1230');
    await act(async () => {
      result.current.backspace();
    });

    expect(result.current.digits).toBe('123');
    expect(result.current.draftSeconds).toBe(1 * 60 + 23);
  });

  it('clear resets the draft and marks it dirty', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await typeAll(result, '45');
    await act(async () => {
      result.current.clear();
    });

    expect(result.current.digits).toBe('');
    expect(result.current.draftSeconds).toBe(0);
    expect(result.current.isDirty).toBe(true);
  });

  it('beginEdit seeds the draft from a duration without dirtying it', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await act(async () => {
      result.current.beginEdit(12 * 60 + 30);
    });
    expect(result.current.digits).toBe('1230');
    expect(result.current.isDirty).toBe(false);

    await typeAll(result, '5');
    expect(result.current.digits).toBe('12305');
  });

  it('beginEdit normalizes out leading zeros', async () => {
    const { result } = await renderHook(() => useDurationEntry());

    await act(async () => {
      result.current.beginEdit(5);
    });

    expect(result.current.digits).toBe('5');
  });
});