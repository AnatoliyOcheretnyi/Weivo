import type { ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuroraBackground } from '@/shared/components/AuroraBackground/AuroraBackground'
import { authScreenContainerStyles } from './AuthScreenContainer.styles'

type AuthScreenContainerProps = {
  children: ReactNode
}

export function AuthScreenContainer({ children }: AuthScreenContainerProps) {
  return (
    <SafeAreaView
      style={authScreenContainerStyles.screen}
      edges={['top', 'left', 'right', 'bottom']}>
      <AuroraBackground />
      <View style={authScreenContainerStyles.content}>{children}</View>
    </SafeAreaView>
  )
}
