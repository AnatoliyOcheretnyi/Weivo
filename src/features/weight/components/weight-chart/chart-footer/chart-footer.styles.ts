import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { fontSizes, letterSpacings } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const chartFooterStyles = StyleSheet.create({
  footerRow: {
    marginTop: spacing.huge,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.sm,
    color: colors.inkSoft,
  },
  footerValue: {
    marginTop: spacing.sm,
    fontSize: fontSizes.base,
    color: colors.ink,
  },
});
