import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { createAuthEntryScreenStyles } from './AuthEntryScreen.styles'

export default function AuthChoiceScreen() {
  const router = useRouter()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createAuthEntryScreenStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>{texts.auth.accountTitle}</Text>
        <Text style={styles.body}>{texts.auth.accountBody}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={texts.auth.signUp}
          variant="primary"
          onPress={() => router.replace('/auth/signup' as Href)}
        />
        <Button
          title={texts.auth.logIn}
          variant="inverse"
          onPress={() => router.replace('/auth/login' as Href)}
        />
        <Button
          title={texts.onboarding.back}
          variant="inverseSmall"
          onPress={() => router.replace('/welcome' as Href)}
        />
      </View>
    </SafeAreaView>
  )
}
