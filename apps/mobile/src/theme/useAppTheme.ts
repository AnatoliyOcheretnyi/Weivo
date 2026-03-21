import { useTheme as useSystemTheme } from '@/hooks/useTheme'
import { useProfileStore } from '@/features/profile'
import { themes } from './colors'
export const useAppTheme = () => {
  const { profile } = useProfileStore()
  const systemScheme = useSystemTheme() ?? 'light'
  const scheme =
    profile.theme && profile.theme in themes ? profile.theme : systemScheme
  const colors = themes[scheme]
  return { scheme, colors }
}
