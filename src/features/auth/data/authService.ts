import * as WebBrowser from 'expo-web-browser'
import { isSupabaseConfigured, supabase } from '@/shared/services/supabase/client'

const normalizeEmail = (value: string) => value.trim().toLowerCase()
WebBrowser.maybeCompleteAuthSession()

const mapAuthError = (error: unknown) => {
  if (!isSupabaseConfigured()) {
    return 'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  }

  const code =
    typeof error === 'object' && error && 'code' in error
      ? String((error as { code?: string }).code)
      : ''
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: string }).message)
      : ''

  switch (code) {
    case 'auth_cancelled':
      return 'Google sign-in was cancelled.'
    case 'invalid_credentials':
      return 'Please enter a valid email address.'
    case 'email_not_confirmed':
      return 'Please confirm your email and try again.'
    case 'invalid_login_credentials':
    case 'invalid_grant':
      return 'Invalid email or password.'
    case 'user_already_exists':
      return 'An account with this email already exists.'
    case 'weak_password':
      return 'Password should be at least 6 characters.'
    case 'network_error':
      return 'Network error. Please check your connection and try again.'
    default:
      if (message) {
        return message
      }
      return 'Authentication failed. Please try again.'
  }
}

const parseAuthParamsFromUrl = (url: string) => {
  const [withoutHash, hash = ''] = url.split('#')
  const query = withoutHash.split('?')[1] ?? ''
  const hashParams = new URLSearchParams(hash)
  const queryParams = new URLSearchParams(query)

  return {
    accessToken: hashParams.get('access_token') ?? queryParams.get('access_token'),
    refreshToken: hashParams.get('refresh_token') ?? queryParams.get('refresh_token'),
    code: hashParams.get('code') ?? queryParams.get('code'),
  }
}

const ensureProfileRow = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    if (userError) {
      console.error('Failed to load authenticated user from Supabase', userError)
    }
    return
  }

  const fullName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
    null
  const avatarUrl =
    (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) || null

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      username: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (profileError) {
    console.error('Failed to create profile row in Supabase', profileError)
  }
}

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizeEmail(email),
        password,
      })
      if (error) {
        return { ok: false as const, message: mapAuthError(error) }
      }
      await ensureProfileRow()
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },

  async signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email: normalizeEmail(email),
        password,
      })
      if (error) {
        return { ok: false as const, message: mapAuthError(error) }
      }
      await ensureProfileRow()
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { ok: false as const, message: mapAuthError(error) }
      }
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },

  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      return {
        ok: false as const,
        message:
          'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      }
    }

    try {
      const redirectTo = 'weivo://auth/callback'
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      })

      if (error || !data?.url) {
        return { ok: false as const, message: mapAuthError(error) }
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
      if (result.type !== 'success' || !result.url) {
        return { ok: false as const, message: mapAuthError({ code: 'auth_cancelled' }) }
      }

      const { accessToken, refreshToken, code } = parseAuthParamsFromUrl(result.url)

      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (sessionError) {
          return { ok: false as const, message: mapAuthError(sessionError) }
        }
      } else if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          return { ok: false as const, message: mapAuthError(exchangeError) }
        }
      } else {
        return { ok: false as const, message: 'Google sign-in did not return a valid session.' }
      }

      await ensureProfileRow()
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },
}
