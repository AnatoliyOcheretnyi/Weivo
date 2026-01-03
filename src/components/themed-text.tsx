import { Text, type TextProps } from 'react-native';

import { useMemo } from 'react';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/theme';
import { createThemedTextStyles } from './themed-text.styles';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { colors } = useAppTheme();
  const themedTextStyles = useMemo(() => createThemedTextStyles(colors), [colors]);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? themedTextStyles.default : undefined,
        type === 'title' ? themedTextStyles.title : undefined,
        type === 'defaultSemiBold' ? themedTextStyles.defaultSemiBold : undefined,
        type === 'subtitle' ? themedTextStyles.subtitle : undefined,
        type === 'link' ? themedTextStyles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
