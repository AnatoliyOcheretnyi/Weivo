import { Text, View } from 'react-native';

import type { ChartGridProps } from './ChartGridTypes';
import { useMemo } from 'react';
import { useAppTheme } from '@/theme';
import { createChartGridStyles } from './ChartGridStyles';

export function ChartGrid({ height, labels }: ChartGridProps) {
  const { colors } = useAppTheme();
  const chartGridStyles = useMemo(() => createChartGridStyles(colors), [colors]);
  const labelHeight = 12;
  const labelInset = 2;

  return (
    <View style={[chartGridStyles.grid, { height }]} pointerEvents="none">
      <View style={[chartGridStyles.gridLine, { top: 0 }]} />
      <View style={[chartGridStyles.gridLine, { top: height * 0.33 }]} />
      <View style={[chartGridStyles.gridLine, { top: height * 0.66 }]} />
      <View style={[chartGridStyles.gridLine, { top: height }]} />
      {labels ? (
        <>
          <Text style={[chartGridStyles.label, { top: labelInset }]}>
            {labels.top}
          </Text>
          <Text
            style={[
              chartGridStyles.label,
              { top: height * 0.5 - labelHeight / 2 },
            ]}>
            {labels.middle}
          </Text>
          <Text
            style={[
              chartGridStyles.label,
              { top: height - labelHeight - labelInset },
            ]}>
            {labels.bottom}
          </Text>
        </>
      ) : null}
    </View>
  );
}
