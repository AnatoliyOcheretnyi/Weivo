import { Text, View } from 'react-native';

import type { ChartHeaderProps } from './types';
import { chartHeaderStyles } from '@/theme/styles/weight-chart/chart-header';
import { texts } from '@/texts';

export function ChartHeader({ min, max, total }: ChartHeaderProps) {
  return (
    <View style={chartHeaderStyles.headerRow}>
      <View>
        <Text style={chartHeaderStyles.title}>{texts.chart.title}</Text>
        <Text style={chartHeaderStyles.subtitle}>{total} {texts.chart.subtitleSuffix}</Text>
      </View>
      <View style={chartHeaderStyles.rangePill}>
        <Text style={chartHeaderStyles.rangeText}>
          {min.toFixed(1)}-{max.toFixed(1)} {texts.chart.unit}
        </Text>
      </View>
    </View>
  );
}
