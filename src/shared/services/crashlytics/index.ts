import * as Sentry from '@sentry/react-native'
type CrashlyticsInitOptions = {
  dsn?: string
  tracesSampleRate?: number
}
type CrashlyticsUser = {
  id?: string
  email?: string
  username?: string
}
type CrashlyticsBreadcrumb = {
  message: string
  category?: string
  level?: Sentry.SeverityLevel
  data?: Record<string, unknown>
}
const defaultTracesSampleRate = __DEV__ ? 1 : 0.2
let isInitialized = false
export const crashlytics = {
  init: ({ dsn, tracesSampleRate }: CrashlyticsInitOptions = {}) => {
    if (isInitialized || !dsn) {
      return
    }
    Sentry.init({
      dsn,
      enableAutoSessionTracking: true,
      tracesSampleRate: tracesSampleRate ?? defaultTracesSampleRate,
      environment: __DEV__ ? 'development' : 'production',
    })
    isInitialized = true
  },
  captureException: (error: unknown, context?: Record<string, unknown>) => {
    if (context) {
      Sentry.withScope((scope) => {
        scope.setContext('context', context)
        Sentry.captureException(error)
      })
      return
    }
    Sentry.captureException(error)
  },
  captureMessage: (message: string, level?: Sentry.SeverityLevel) => {
    if (level) {
      Sentry.captureMessage(message, level)
      return
    }
    Sentry.captureMessage(message)
  },
  setUser: (user: CrashlyticsUser | null) => {
    Sentry.setUser(user)
  },
  clearUser: () => {
    Sentry.setUser(null)
  },
  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value)
  },
  addBreadcrumb: (breadcrumb: CrashlyticsBreadcrumb) => {
    Sentry.addBreadcrumb(breadcrumb)
  },
  setContext: (name: string, context: Record<string, unknown>) => {
    Sentry.setContext(name, context)
  },
  flush: () => Sentry.flush(),
}
