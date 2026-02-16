import { isSupabaseConfigured, supabase } from '@/shared/services/supabase/client'

const normalizeEmail = (value: string) => value.trim().toLowerCase()

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
}
