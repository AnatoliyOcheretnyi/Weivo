import type { StyleProp, TextStyle, ViewStyle , TextInputProps } from 'react-native'
export type InputVariant = 'default' | 'compact';
export type InputProps = Omit<TextInputProps, 'style'> & {
  variant?: InputVariant;
  unit?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  unitStyle?: StyleProp<TextStyle>;
};
