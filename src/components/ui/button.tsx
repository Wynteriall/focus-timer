import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ label, variant = 'secondary', disabled, ...rest }: ButtonProps) {
  const theme = useTheme();
  const background = variant === 'primary' ? theme.text : theme.backgroundElement;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      {...rest}
    >
      <ThemedText
        type="smallBold"
        style={{ color: variant === 'primary' ? theme.background : theme.text }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: Spacing.four,
    minWidth: 96,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
