import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { dimensions } from '@/theme/dimensions';
import { fontSizes, letterSpacings } from '@/theme/typography';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';

export const createModalStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
      padding: spacing.mega,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.card,
      padding: dimensions.modal.padding,
      shadowColor: colors.ink,
      shadowOpacity: shadows.card.shadowOpacity,
      shadowRadius: shadows.card.shadowRadius,
      shadowOffset: shadows.card.shadowOffset,
    },
    title: {
      fontSize: fontSizes.title,
      color: colors.ink,
    },
    subtitle: {
      marginTop: spacing.md,
      fontSize: fontSizes.md,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.giant,
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.xxxl,
      backgroundColor: colors.creamCard,
      borderRadius: dimensions.modal.inputRadius,
    },
    input: {
      flex: 1,
      fontSize: fontSizes.input,
      color: colors.ink,
    },
    unit: {
      fontSize: fontSizes.xl,
      color: colors.inkSoft,
    },
    sectionLabel: {
      marginTop: spacing.giant,
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.md,
      color: colors.inkSoft,
    },
    moodRow: {
      flexDirection: 'row',
      gap: spacing.xxl,
      marginTop: spacing.xxl,
    },
    moodButton: {
      width: dimensions.modal.moodButton,
      height: dimensions.modal.moodButton,
      borderRadius: dimensions.modal.moodButtonRadius,
      backgroundColor: colors.cream,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moodButtonActive: {
      backgroundColor: colors.inkStrong,
    },
    moodLabel: {
      fontSize: fontSizes.xxl,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xxlLarge,
    },
    cancelButton: {
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.giant,
    },
    cancelText: {
      color: colors.inkMutedLight,
      fontSize: fontSizes.lg,
    },
    saveButton: {
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.xxlLarge,
      borderRadius: radii.md,
      backgroundColor: colors.inkStrong,
    },
    saveButtonDisabled: {
      backgroundColor: colors.inkAccent,
    },
    saveText: {
      color: colors.highlight,
      fontSize: fontSizes.lg,
    },
  });
