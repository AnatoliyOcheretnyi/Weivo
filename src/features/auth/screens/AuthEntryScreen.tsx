import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter, type Href } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setActiveMode(mode)
  }, [mode])

  const isLogin = activeMode === 'login'
  const title = isLogin ? texts.auth.loginTitle : texts.auth.signUpTitle
  const body = isLogin ? texts.auth.loginBody : texts.auth.signUpBody
  const submitTitle = isLogin ? texts.auth.logIn : texts.auth.signUp

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
    if (!email.trim()) {
      setErrorText(texts.auth.errors.emailRequired)
      return
    }
    if (!password) {
      setErrorText(texts.auth.errors.passwordRequired)
      return
    }
    if (!isLogin && password.length < 6) {
      setErrorText(texts.auth.errors.passwordMin)
      return
    }
    if (!isLogin && password !== confirmPassword) {
      setErrorText(texts.auth.errors.passwordMismatch)
      return
    }

    setErrorText('')
    setIsSubmitting(true)

    const result = isLogin
      ? await authService.signIn(email, password)
      : await authService.signUp(email, password)

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

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder={texts.auth.emailPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={texts.auth.passwordPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType={isLogin ? 'password' : 'newPassword'}
          />
          {!isLogin ? (
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={texts.auth.confirmPasswordPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              textContentType="password"
            />
          ) : null}
          <Text style={styles.helperText}>{texts.auth.passwordHint}</Text>
          {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
          <Button
            title={submitTitle}
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </AuthScreenContainer>
  )
}
