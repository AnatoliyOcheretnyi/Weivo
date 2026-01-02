import { View } from 'react-native';

import type { ChartGridProps } from './types';
import { chartGridStyles } from '@/theme/styles/weight-chart/chart-grid';

export function ChartGrid({ height }: ChartGridProps) {
  return (
    <View style={[chartGridStyles.grid, { height }]}>
      <View style={[chartGridStyles.gridLine, { top: 0 }]} />
      <View style={[chartGridStyles.gridLine, { top: height * 0.33 }]} />
      <View style={[chartGridStyles.gridLine, { top: height * 0.66 }]} />
      <View style={[chartGridStyles.gridLine, { top: height }]} />
    </View>
  );
}
