import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const createGoalProgressStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    canvasWrap: {
      width: 84,
      height: 84,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerText: {
      fontSize: fontSizes.lg,
      color: colors.ink,
      fontFamily: fontFamilies.display,
      letterSpacing: letterSpacings.sm,
    },
  });
