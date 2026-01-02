import { Text, View } from 'react-native';

import type { ChartGridProps } from './types';
import { chartGridStyles } from '@/theme/styles/weight-chart/chart-grid';

export function ChartGrid({ height, labels }: ChartGridProps) {
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
