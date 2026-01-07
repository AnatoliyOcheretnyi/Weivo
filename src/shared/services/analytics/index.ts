import { getApp, getApps } from '@react-native-firebase/app'
import {
  getAnalytics,
  logEvent,
  logScreenView,
  resetAnalyticsData,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import { createMMKV } from 'react-native-mmkv'
import {
  buildAnalyticsEventName,
  type Screen,
  type Trigger,
  type Action,
} from './AnalyticsEvents'
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
    const analyticsInstance = getAnalytics(getApp())
    if (enabled != null) {
      await setAnalyticsCollectionEnabled(analyticsInstance, enabled)
    }
    const userId = getOrCreateUserId()
    if (userId) {
      await setUserId(analyticsInstance, userId)
    }
    isInitialized = true
  },
  ensureUserId: async () => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return null
    }
    const analyticsInstance = getAnalytics(getApp())
    const userId = getOrCreateUserId()
    if (userId) {
      await setUserId(analyticsInstance, userId)
    }
    return userId
  },
  logEvent: (name: string, params?: AnalyticsEventParams) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return logEvent(getAnalytics(getApp()), name, params)
  },
  createAnalyticEvent: ({
    screen,
    action,
    trigger,
    extraProperties,
  }: {
    screen: Screen
    action: Action
    trigger?: Trigger
    extraProperties?: AnalyticsEventParams
  }) => {
    const name = buildAnalyticsEventName({ screen, trigger, action })
    return analyticsService.logEvent(name, {
      screen,
      trigger,
      action,
      ...extraProperties,
    })
  },
  logView: (screen: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return logEvent(getAnalytics(getApp()), 'view_screen', { screen })
  },
  logClick: (target: string, screen?: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return logEvent(getAnalytics(getApp()), 'click', screen ? { target, screen } : { target })
  },
  logScreenView: (screenName: string, screenClass?: string) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return logScreenView(getAnalytics(getApp()), {
      screen_name: screenName,
      screen_class: screenClass,
    })
  },
  setUserId: (id: string | null) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return setUserId(getAnalytics(getApp()), id)
  },
  setUserProperties: (properties: AnalyticsUserProperties) => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return setUserProperties(getAnalytics(getApp()), properties)
  },
  resetAnalyticsData: () => {
    if (!hasFirebaseApp()) {
      warnMissingFirebase()
      return resolveVoid
    }
    return resetAnalyticsData(getAnalytics(getApp()))
  },
}
const warnMissingFirebase = () => {
  if (__DEV__) {
    console.warn('Firebase app is not initialized yet; analytics is disabled.')
  }
}
const hasFirebaseApp = () => {
  try {
    return getApps().length > 0
  } catch {
    return false
  }
}
const resolveVoid = Promise.resolve()
export { Actions, Screens, Triggers } from './AnalyticsEvents'
