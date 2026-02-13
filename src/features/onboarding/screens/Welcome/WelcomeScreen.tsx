import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { useProfileStore } from '@/features/profile'
import { Button } from '@/shared/components/Button'
import { AuroraBackground } from '@/shared/components/AuroraBackground/AuroraBackground'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { createWelcomeScreenStyles } from './WelcomeScreen.styles'

export default function WelcomeScreen() {
  const router = useRouter()
  const { updateProfile } = useProfileStore()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createWelcomeScreenStyles(colors), [colors])

  const handleContinueAsGuest = () => {
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
          onPress={() => {
            updateProfile({ hasSeenWelcome: true })
            router.replace('/auth' as Href)
          }}
        />
        <Button
          title={texts.auth.continueGuest}
          variant="inverse"
          onPress={handleContinueAsGuest}
        />
      </View>
    </SafeAreaView>
  )
}
