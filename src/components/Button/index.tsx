import type { ButtonProps, ButtonVariant } from './ButtonTypes';
import { ButtonBase } from './Button';

export type { ButtonProps, ButtonVariant };

export function Button({
  variant = 'primary',
  ...props
}: ButtonProps) {
  switch (variant) {
    case 'primarySmall':
      return <ButtonBase {...props} variant="primary" size="sm" />;
    case 'inverse':
      return <ButtonBase {...props} variant="inverse" size="md" />;
    case 'inverseSmall':
      return <ButtonBase {...props} variant="inverse" size="sm" />;
    case 'primary':
    default:
      return <ButtonBase {...props} variant="primary" size="md" />;
  }
}
