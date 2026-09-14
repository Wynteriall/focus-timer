import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';

export type CountdownDisplayProps = {
  remaining: number;
};

export function formatTime(totalSeconds: number): string {
  const total = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function CountdownDisplay({ remaining }: CountdownDisplayProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.time}>
        {formatTime(remaining)}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        remaining
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  time: {
    fontFamily: Fonts.mono,
    fontVariant: ['tabular-nums'],
    fontSize: 72,
    lineHeight: 84,
  },
});
