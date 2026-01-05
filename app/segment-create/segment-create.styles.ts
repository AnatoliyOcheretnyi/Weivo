import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { dimensions } from '@/theme/dimensions';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';

export const createSegmentCreateStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    card: {
      margin: dimensions.modal.margin,
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: dimensions.modal.padding,
      paddingTop: dimensions.modal.paddingTop,
      ...shadows.soft,
    },
    handle: {
      width: dimensions.modal.handleWidth,
      height: dimensions.modal.handleHeight,
      borderRadius: radii.pill,
      alignSelf: 'center',
      backgroundColor: colors.creamHandle,
      marginBottom: spacing.xxl,
    },
    title: {
      fontSize: fontSizes.title,
      fontFamily: fontFamilies.display,
      color: colors.ink,
      letterSpacing: letterSpacings.sm,
    },
    subtitle: {
      marginTop: spacing.md,
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.xs,
      textTransform: 'uppercase',
    },
    section: {
      marginTop: spacing.xMassive,
    },
    label: {
      fontSize: fontSizes.xs,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
      marginBottom: spacing.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.creamCard,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.xMassive,
      paddingVertical: spacing.huge,
    },
    input: {
      flex: 1,
      fontSize: fontSizes.input,
      color: colors.ink,
      fontFamily: fontFamilies.display,
      letterSpacing: letterSpacings.sm,
    },
    unit: {
      fontSize: fontSizes.md,
      color: colors.inkSoft,
    },
    segmentedRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    segment: {
      flexGrow: 1,
      minWidth: 110,
      backgroundColor: colors.creamCard,
      borderRadius: radii.lg,
      paddingVertical: spacing.huge,
      paddingHorizontal: spacing.xMassive,
      alignItems: 'center',
    },
    segmentActive: {
      backgroundColor: colors.inkStrong,
    },
    segmentText: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    segmentTextActive: {
      color: colors.highlight,
    },
    helper: {
      marginTop: spacing.sm,
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
    },
    actionRow: {
      marginTop: spacing.xMassive,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.lg,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: spacing.huge,
      borderRadius: radii.pill,
      backgroundColor: colors.cream,
      alignItems: 'center',
    },
    cancelText: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    saveButton: {
      flex: 1,
      paddingVertical: spacing.huge,
      borderRadius: radii.pill,
      backgroundColor: colors.inkStrong,
      alignItems: 'center',
    },
    saveText: {
      fontSize: fontSizes.md,
      color: colors.highlight,
      letterSpacing: letterSpacings.sm,
    },
  });
