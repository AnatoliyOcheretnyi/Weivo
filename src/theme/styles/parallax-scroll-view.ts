import { StyleSheet } from 'react-native';

import { dimensions } from '../dimensions';
import { spacing } from '../spacing';

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
