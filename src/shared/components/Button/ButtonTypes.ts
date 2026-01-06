import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'primarySmall' | 'inverse' | 'inverseSmall';
export type ButtonSize = 'md' | 'sm';

export type ButtonBaseProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'inverse';
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export type ButtonProps = Omit<ButtonBaseProps, 'variant' | 'size'> & {
  variant?: ButtonVariant;
};
