import { forwardRef } from 'react'
import type { TextInput } from 'react-native'
import type { InputProps, InputVariant } from './InputTypes'
import { Input as InputBase } from './Input'
export type { InputProps, InputVariant }
export const Input = forwardRef<TextInput, InputProps>(function Input(
  { variant = 'default', ...props },
  ref
) {
  switch (variant) {
    case 'compact':
      return <InputBase {...props} ref={ref} variant="compact" />
    case 'default':
    default:
      return <InputBase {...props} ref={ref} variant="default" />
  }
})
