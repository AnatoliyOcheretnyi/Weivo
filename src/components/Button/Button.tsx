import { Pressable, Text } from 'react-native';

import { useAppTheme } from '@/theme';
import type { ButtonBaseProps } from './ButtonTypes';
import { buttonStyles } from './ButtonStyles';

export function ButtonBase({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}: ButtonBaseProps) {
  const { colors } = useAppTheme();
  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: colors.inkStrong, borderColor: colors.inkStrong }
      : { backgroundColor: colors.cream, borderColor: colors.creamLine };
  const labelColor = variant === 'primary' ? colors.highlight : colors.inkMuted;

  return (
    <Pressable
      style={[
        buttonStyles.button,
        buttonStyles[size],
        variantStyle,
        disabled && buttonStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          buttonStyles.text,
          buttonStyles[`${size}Text`],
          { color: labelColor },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
