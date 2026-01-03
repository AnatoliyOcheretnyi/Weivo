import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfileStore } from '@/features/profile';
import { themes } from './colors';

export const useAppTheme = () => {
  const { profile } = useProfileStore();
  const systemScheme = useColorScheme() ?? 'light';
  const scheme =
    profile.theme === 'dark' ? 'dark' : profile.theme === 'light' ? 'light' : systemScheme;
  const colors = themes[scheme];
  return { scheme, colors };
};
