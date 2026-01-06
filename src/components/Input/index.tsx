import type { InputProps, InputVariant } from './InputTypes';
import { Input as InputBase } from './Input';

export type { InputProps, InputVariant };

export function Input({ variant = 'default', ...props }: InputProps) {
  switch (variant) {
    case 'compact':
      return <InputBase {...props} variant="compact" />;
    case 'default':
    default:
      return <InputBase {...props} variant="default" />;
  }
}
