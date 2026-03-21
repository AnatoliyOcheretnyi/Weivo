import { useMemo, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { useProfileStore } from '@/features/profile'
import { Button } from '@/shared/components/Button'
import { AuroraBackground } from '@/shared/components/AuroraBackground/AuroraBackground'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { authService } from '@/features/auth/data/authService'
import { createWelcomeScreenStyles } from './WelcomeScreen.styles'

export default function WelcomeScreen() {
  const router = useRouter()
  const { updateProfile } = useProfileStore()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createWelcomeScreenStyles(colors), [colors])

  const handleContinueAsGuest = () => {
    updateProfile({ hasSeenWelcome: true })
    router.replace('/onboarding' as Href)
  }

  const handleUseAccount = async () => {
    if (isSigningIn) {
      return
    }

    setIsSigningIn(true)
    const result = await authService.signInWithGoogle()
    setIsSigningIn(false)

    if (!result.ok) {
      Alert.alert('Sign-in failed', result.message)
      return
    }

    updateProfile({ hasSeenWelcome: true })
    router.replace('/onboarding' as Href)
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      <AuroraBackground />
      <View style={styles.content}>
        <Text style={styles.title}>{texts.onboarding.welcomeTitle}</Text>
        <Text style={styles.subtitle}>{texts.onboarding.subtitle}</Text>
        <Text style={styles.body}>{texts.onboarding.welcomeBody}</Text>
        <Text style={styles.body}>{texts.onboarding.welcomeExtra}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={texts.auth.account}
          onPress={handleUseAccount}
          disabled={isSigningIn}
        />
        <Button
          title={texts.auth.continueGuest}
          variant="inverse"
          onPress={handleContinueAsGuest}
          disabled={isSigningIn}
        />
      </View>
    </SafeAreaView>
  )
}
