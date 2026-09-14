import { render, userEvent } from '@testing-library/react-native';

import { CountdownControls } from '@/components/ui/countdown-controls';

type RenderOptions = {
  startLabel?: string;
  isRunning?: boolean;
  canStart?: boolean;
};

async function renderControls({
  startLabel = 'Start',
  isRunning = false,
  canStart = true,
}: RenderOptions = {}) {
  const handlers = {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onReset: jest.fn(),
  };
  const queries = await render(
    <CountdownControls
      startLabel={startLabel}
      isRunning={isRunning}
      canStart={canStart}
      onStart={handlers.onStart}
      onPause={handlers.onPause}
      onReset={handlers.onReset}
    />
  );
  return { handlers, queries, user: userEvent.setup() };
}

describe('CountdownControls', () => {
  it('renders start, pause, and reset controls', async () => {
    const { queries } = await renderControls();

    expect(queries.getByLabelText('Start')).toBeOnTheScreen();
    expect(queries.getByLabelText('Pause')).toBeOnTheScreen();
    expect(queries.getByLabelText('Reset')).toBeOnTheScreen();
  });

  it('disables start and enables pause while running', async () => {
    const { queries } = await renderControls({ isRunning: true });

    expect(queries.getByLabelText('Start')).toBeDisabled();
    expect(queries.getByLabelText('Pause')).toBeEnabled();
  });

  it('disables start when nothing remains', async () => {
    const { queries } = await renderControls({ canStart: false });

    expect(queries.getByLabelText('Start')).toBeDisabled();
  });

  it('disables pause when not running', async () => {
    const { queries } = await renderControls();

    expect(queries.getByLabelText('Pause')).toBeDisabled();
  });

  it('invokes the start and reset callbacks on press', async () => {
    const { handlers, queries, user } = await renderControls();

    await user.press(queries.getByLabelText('Start'));
    await user.press(queries.getByLabelText('Reset'));

    expect(handlers.onStart).toHaveBeenCalledTimes(1);
    expect(handlers.onReset).toHaveBeenCalledTimes(1);
  });

  it('invokes the pause callback on press while running', async () => {
    const { handlers, queries, user } = await renderControls({ isRunning: true });

    await user.press(queries.getByLabelText('Pause'));

    expect(handlers.onPause).toHaveBeenCalledTimes(1);
  });

  it('uses the provided start label', async () => {
    const { queries } = await renderControls({ startLabel: 'Resume' });

    expect(queries.getByLabelText('Resume')).toBeOnTheScreen();
  });
});
