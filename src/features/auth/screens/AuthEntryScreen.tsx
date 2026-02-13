import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { createAuthEntryScreenStyles } from './AuthEntryScreen.styles'

type AuthEntryScreenProps = {
  mode: 'login' | 'signup'
}

export default function AuthEntryScreen({ mode }: AuthEntryScreenProps) {
  const router = useRouter()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createAuthEntryScreenStyles(colors), [colors])

  const isLogin = mode === 'login'
  const title = isLogin ? texts.auth.loginTitle : texts.auth.signUpTitle
  const body = isLogin ? texts.auth.loginBody : texts.auth.signUpBody

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={texts.auth.continueGuest}
          variant="primary"
          onPress={() => router.replace('/onboarding' as Href)}
        />
        <Button
          title={texts.onboarding.back}
          variant="inverse"
          onPress={() => router.replace('/welcome' as Href)}
        />
      </View>
    </SafeAreaView>
  )
}
