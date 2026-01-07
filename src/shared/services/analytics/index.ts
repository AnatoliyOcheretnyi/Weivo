import analytics from '@react-native-firebase/analytics'
import { getApps } from '@react-native-firebase/app'
import { createMMKV } from 'react-native-mmkv'
type AnalyticsInitOptions = {
  enabled?: boolean
}
type AnalyticsEventParams = Record<string, unknown>
type AnalyticsUserProperties = Record<string, string | null>
let isInitialized = false
const USER_ID_KEY = 'analytics_user_id_v1'
const storage = (() => {
  try {
    return createMMKV({ id: 'weivo' })
  } catch {
    return null
  }
})()
const createUserId = () => {
  const random = Math.random().toString(36).slice(2)
  const time = Date.now().toString(36)
  return `uid_${time}_${random}`
}
const getOrCreateUserId = () => {
  if (!storage) {
    return null
  }
  const existing = storage.getString(USER_ID_KEY)
  if (existing) {
    return existing
  }
  const next = createUserId()
  storage.set(USER_ID_KEY, next)
  return next
}
export const analyticsService = {
  init: async ({ enabled }: AnalyticsInitOptions = {}) => {
    if (isInitialized) {
      return
    }
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return
    }
    if (enabled != null) {
      await analytics().setAnalyticsCollectionEnabled(enabled)
    }
    const userId = getOrCreateUserId()
    if (userId) {
      await analytics().setUserId(userId)
    }
    isInitialized = true
  },
  ensureUserId: async () => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return null
    }
    const userId = getOrCreateUserId()
    if (userId) {
      await analytics().setUserId(userId)
    }
    return userId
  },
  logEvent: (name: string, params?: AnalyticsEventParams) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().logEvent(name, params)
  },
  logView: (screen: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().logEvent('view_screen', { screen })
  },
  logClick: (target: string, screen?: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().logEvent('click', screen ? { target, screen } : { target })
  },
  logScreenView: (screenName: string, screenClass?: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().logScreenView({ screen_name: screenName, screen_class: screenClass })
  },
  setUserId: (id: string | null) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().setUserId(id)
  },
  setUserProperties: (properties: AnalyticsUserProperties) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().setUserProperties(properties)
  },
  resetAnalyticsData: () => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return analytics().resetAnalyticsData()
  },
}
const warnMissingFirebase = () => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('Firebase app is not initialized yet; analytics is disabled.')
  }
}
const hasFirebaseApp = () => getApps().length > 0
const resolveVoid = Promise.resolve()
