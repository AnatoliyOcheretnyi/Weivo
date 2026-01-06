export const PROFILE_TABS = ['profile', 'account'] as const
export const SEX_OPTIONS = ['male', 'female'] as const
export const ACTIVITY_OPTIONS = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'veryActive',
] as const
export const GOAL_TYPE_OPTIONS = ['lose', 'maintain', 'gain'] as const
export const UNIT_OPTIONS = ['metric', 'imperial'] as const
export const LANGUAGE_OPTIONS = ['en', 'uk', 'es'] as const
export const THEME_OPTIONS = ['light', 'dark', 'rose', 'sky', 'mint'] as const
export const GOAL_RATE_MAX_GAIN = 0.5
export const GOAL_RATE_MAX_LOSE = 1
export const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1)
