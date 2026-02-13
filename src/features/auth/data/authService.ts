import auth from '@react-native-firebase/auth'

const normalizeEmail = (value: string) => value.trim().toLowerCase()

const mapAuthError = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error
    ? String((error as { code?: string }).code)
    : ''

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    default:
      return 'Authentication failed. Please try again.'
  }
}

export const authService = {
  async signIn(email: string, password: string) {
    try {
      await auth().signInWithEmailAndPassword(normalizeEmail(email), password)
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },

  async signUp(email: string, password: string) {
    try {
      await auth().createUserWithEmailAndPassword(normalizeEmail(email), password)
      return { ok: true as const }
    } catch (error) {
      return { ok: false as const, message: mapAuthError(error) }
    }
  },
}
