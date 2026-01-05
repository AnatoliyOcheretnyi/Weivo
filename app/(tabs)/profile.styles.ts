import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import { fontSizes, letterSpacings } from '@/theme/typography';

export const createProfileStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      paddingHorizontal: spacing.mega,
      paddingTop: spacing.mega,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.lg,
    },
    headerContent: {
      flex: 1,
      paddingRight: spacing.lg,
    },
    title: {
      fontSize: fontSizes.displaySm,
      color: colors.ink,
      letterSpacing: letterSpacings.sm,
    },
    subtitle: {
      marginTop: spacing.sm,
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.lg,
    },
    editButton: {
      borderRadius: radii.full,
      borderWidth: 1,
      borderColor: colors.creamLine,
      backgroundColor: colors.creamLight,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.lg,
      alignSelf: 'flex-start',
    },
    editText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    section: {
      marginTop: spacing.xMassive,
      gap: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionAction: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radii.pill,
      backgroundColor: colors.creamLight,
    },
    sectionActionText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    sectionTitle: {
      fontSize: fontSizes.md,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.xl,
    },
    card: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      gap: spacing.xl,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.lg,
    },
    subRow: {
      paddingLeft: spacing.xl,
    },
    subLabel: {
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
      letterSpacing: letterSpacings.sm,
    },
    subValue: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxl,
    },
    linkIcon: {
      marginTop: 2,
    },
    label: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
    },
    value: {
      fontSize: fontSizes.md,
      color: colors.ink,
    },
  });
