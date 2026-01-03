import { StyleSheet } from 'react-native';

import { dimensions } from '@/theme/dimensions';
import { spacing } from '@/theme/spacing';

export const parallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: dimensions.parallax.headerHeight,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: spacing.xMassive,
    gap: spacing.huge,
    overflow: 'hidden',
  },
});
