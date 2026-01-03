import { StyleSheet } from 'react-native';

import { fontSizes, lineHeights } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const helloWaveStyles = StyleSheet.create({
  wave: {
    fontSize: fontSizes.emoji,
    lineHeight: lineHeights.lg,
    marginTop: -spacing.md,
    animationName: {
      '50%': { transform: [{ rotate: '25deg' }] },
    },
    animationIterationCount: 4,
    animationDuration: '300ms',
  },
});
