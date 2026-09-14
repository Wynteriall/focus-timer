import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';

export type CountdownControlsProps = {
  startLabel: string;
  isRunning: boolean;
  canStart: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function CountdownControls({
  startLabel,
  isRunning,
  canStart,
  onStart,
  onPause,
  onReset,
}: CountdownControlsProps) {
  return (
    <View style={styles.row}>
      <Button
        label={startLabel}
        variant="primary"
        disabled={isRunning || !canStart}
        onPress={onStart}
      />
      <Button label="Pause" disabled={!isRunning} onPress={onPause} />
      <Button label="Reset" onPress={onReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'center',
  },
});
