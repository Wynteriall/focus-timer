import { render } from '@testing-library/react-native';

import { CountdownDisplay } from '@/components/ui/countdown-display';

describe('CountdownDisplay', () => {
  it('renders the remaining time as mm:ss', async () => {
    const { getByText } = await render(<CountdownDisplay remaining={754} />);

    expect(getByText('12:34')).toBeOnTheScreen();
  });

  it('pads minutes and seconds to two digits', async () => {
    const { getByText } = await render(<CountdownDisplay remaining={65} />);

    expect(getByText('01:05')).toBeOnTheScreen();
  });

  it('renders zero as 00:00', async () => {
    const { getByText } = await render(<CountdownDisplay remaining={0} />);

    expect(getByText('00:00')).toBeOnTheScreen();
  });
});
