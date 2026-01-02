import { StyleSheet } from 'react-native';

import { colors } from '../../colors';
import { fontSizes, letterSpacings } from '../../typography';
import { spacing } from '../../spacing';

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
