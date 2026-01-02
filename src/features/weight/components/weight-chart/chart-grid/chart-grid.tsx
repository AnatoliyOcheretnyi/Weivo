import { View } from 'react-native';

import type { ChartGridProps } from './types';
import { styles } from './styles';

export function ChartGrid({ height }: ChartGridProps) {
  return (
    <View style={[styles.grid, { height }]}>
      <View style={[styles.gridLine, { top: 0 }]} />
      <View style={[styles.gridLine, { top: height * 0.33 }]} />
      <View style={[styles.gridLine, { top: height * 0.66 }]} />
      <View style={[styles.gridLine, { top: height }]} />
    </View>
  );
}
