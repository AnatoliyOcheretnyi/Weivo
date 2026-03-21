import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { IconSymbol } from '@/shared/components/Icon'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { createAuthEntryScreenStyles } from './AuthEntryScreen.styles'
import { authService } from '../data/authService'
import { useProfileStore } from '@/features/profile'
import { AuthScreenContainer } from '../components/AuthScreenContainer'

type AuthEntryScreenProps = {
  mode?: 'login' | 'signup'
  withTabs?: boolean
}

export default function AuthEntryScreen({
  mode = 'login',
  withTabs = false,
}: AuthEntryScreenProps) {
  const router = useRouter()
  const { profile, updateProfile } = useProfileStore()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createAuthEntryScreenStyles(colors), [colors])
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>(mode)
  const [errorText, setErrorText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setActiveMode(mode)
  }, [mode])

  const isLogin = activeMode === 'login'
  const title = isLogin ? texts.auth.loginTitle : texts.auth.signUpTitle
  const body = texts.auth.googleOnlyBody

  const hasProfileData = Boolean(
    profile.birthDateISO ||
      profile.heightCm ||
      profile.sex ||
      profile.goalType ||
      profile.goalTargetKg ||
      profile.goalRangeMinKg ||
      profile.goalRangeMaxKg ||
      profile.activityLevel
  )
  const nextAfterAuth = (!profile.onboardingComplete && !hasProfileData
    ? '/onboarding'
    : '/(tabs)') as Href

  const handleSubmit = async () => {
    setErrorText('')
    setIsSubmitting(true)

    const result = await authService.signInWithGoogle()

    setIsSubmitting(false)

    if (!result.ok) {
      setErrorText(result.message)
      return
    }

    updateProfile({ hasSeenWelcome: true })
    router.replace(nextAfterAuth)
  }

  return (
    <AuthScreenContainer>
      <View style={styles.content}>
        <View style={styles.headerTop}>
          <Pressable
            style={styles.headerBackButton}
            onPress={() => router.replace('/welcome' as Href)}>
            <IconSymbol name="chevron.left" size={16} color={colors.inkMuted} />
          </Pressable>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

        <View style={styles.form}>
          {withTabs ? (
            <View style={styles.tabsRow}>
              <Pressable
                style={[styles.tabButton, isLogin ? styles.tabButtonActive : null]}
                onPress={() => {
                  setActiveMode('login')
                  setErrorText('')
                }}>
                <Text style={[styles.tabLabel, isLogin ? styles.tabLabelActive : null]}>
                  {texts.auth.logIn}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tabButton, !isLogin ? styles.tabButtonActive : null]}
                onPress={() => {
                  setActiveMode('signup')
                  setErrorText('')
                }}>
                <Text style={[styles.tabLabel, !isLogin ? styles.tabLabelActive : null]}>
                  {texts.auth.signUp}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          <Button
            title={texts.auth.continueWithGoogle}
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </AuthScreenContainer>
  )
}
