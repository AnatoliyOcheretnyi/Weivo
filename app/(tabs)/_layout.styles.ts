import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { dimensions } from '@/theme/dimensions';
import { shadows } from '@/theme/shadows';

export const createTabLayoutStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      height: dimensions.tabBar.height,
      paddingTop: dimensions.tabBar.paddingTop,
      paddingBottom: dimensions.tabBar.paddingBottom,
      backgroundColor: colors.creamLighter,
      borderTopWidth: 0,
      shadowColor: colors.ink,
      shadowOpacity: shadows.tabBar.shadowOpacity,
      shadowRadius: shadows.tabBar.shadowRadius,
      shadowOffset: shadows.tabBar.shadowOffset,
      elevation: shadows.tabBar.elevation,
    },
    addWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButton: {
      width: dimensions.tabBar.addButtonSize,
      height: dimensions.tabBar.addButtonSize,
      borderRadius: dimensions.tabBar.addButtonRadius,
      backgroundColor: colors.inkStrong,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.ink,
      shadowOpacity: shadows.addButton.shadowOpacity,
      shadowRadius: shadows.addButton.shadowRadius,
      shadowOffset: shadows.addButton.shadowOffset,
      elevation: shadows.addButton.elevation,
    },
    addIcon: {
      color: colors.highlight,
      fontSize: dimensions.tabBar.addIconSize,
      lineHeight: dimensions.tabBar.addIconLineHeight,
    },
  });
