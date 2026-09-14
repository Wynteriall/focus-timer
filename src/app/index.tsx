import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { CountdownControls } from '@/components/ui/countdown-controls';
import { CountdownDisplay } from '@/components/ui/countdown-display';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCountdown } from '@/hooks/use-countdown';

const INITIAL_SECONDS = 5 * 60;

export default function CountdownScreen() {
  const { remaining, isRunning, start, pause, reset } = useCountdown(INITIAL_SECONDS);

  const canStart = remaining > 0;
  const startLabel = !isRunning && remaining < INITIAL_SECONDS ? 'Resume' : 'Start';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <CountdownDisplay remaining={remaining} />
        <CountdownControls
          startLabel={startLabel}
          isRunning={isRunning}
          canStart={canStart}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
    gap: Spacing.six,
    justifyContent: 'center',
    maxWidth: MaxContentWidth,
    width: '100%',
  },
});

