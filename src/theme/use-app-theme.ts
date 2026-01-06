import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfileStore } from '@/features/profile';
import { themes } from './colors';

export const useAppTheme = () => {
  const { profile } = useProfileStore();
  const systemScheme = useColorScheme() ?? 'light';
  const scheme =
    profile.theme && profile.theme in themes ? profile.theme : systemScheme;
  const colors = themes[scheme];
  return { scheme, colors };
};
