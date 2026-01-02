import { StyleSheet } from 'react-native';

import { spacing } from '../spacing';

export const collapsibleStyles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  content: {
    marginTop: spacing.md,
    marginLeft: spacing.xxlLarge,
  },
});
