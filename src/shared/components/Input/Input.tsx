import { forwardRef } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useAppTheme } from '@/theme'
import type { InputProps } from './InputTypes'
import { inputStyles } from './InputStyles'
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    variant = 'default',
    unit,
    containerStyle,
    inputStyle,
    unitStyle,
    placeholderTextColor,
    ...props
  },
  ref
) {
  const { colors } = useAppTheme()
  return (
    <View
      style={[
        inputStyles.container,
        inputStyles[variant],
        { backgroundColor: colors.creamCard, borderColor: colors.creamLine },
        containerStyle,
      ]}
    >
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor ?? colors.inkAccent}
        style={[inputStyles.input, { color: colors.ink }, inputStyle]}
        {...props}
      />
      {unit ? (
        <Text style={[inputStyles.unit, { color: colors.inkSoft }, unitStyle]}>
          {unit}
        </Text>
      ) : null}
    </View>
  )
})
