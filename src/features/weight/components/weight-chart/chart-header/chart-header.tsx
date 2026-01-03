import { Text, View } from 'react-native';

import type { ChartHeaderProps } from './types';
import { chartHeaderStyles } from './chart-header.styles';
import { useTexts } from '@/i18n';

export function ChartHeader({ min, max, totalDays }: ChartHeaderProps) {
  const { texts } = useTexts();
  return (
    <View style={chartHeaderStyles.headerRow}>
      <View>
        <Text style={chartHeaderStyles.title}>{texts.chart.title}</Text>
        <Text style={chartHeaderStyles.subtitle}>
          {totalDays} {texts.chart.subtitleSuffix}
        </Text>
      </View>
      <View style={chartHeaderStyles.rangePill}>
        <Text style={chartHeaderStyles.rangeText}>
          {min.toFixed(1)}-{max.toFixed(1)} {texts.chart.unit}
        </Text>
      </View>
    </View>
  );
}
