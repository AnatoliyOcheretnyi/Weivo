import { useMemo } from 'react';
import { Text, View } from 'react-native';

import type { ChartFooterProps } from './ChartFooterTypes';
import { useAppTheme } from '@/theme';
import { createChartFooterStyles } from './ChartFooterStyles';
import { useTexts } from '@/i18n';
import { formatShortDate } from '../WeightChartUtils';

export function ChartFooter({ first, last }: ChartFooterProps) {
  const { texts, locale } = useTexts();
  const { colors } = useAppTheme();
  const chartFooterStyles = useMemo(() => createChartFooterStyles(colors), [colors]);
  return (
    <View style={chartFooterStyles.footerRow}>
      <View>
        <Text style={chartFooterStyles.footerLabel}>{texts.chart.start}</Text>
        <Text style={chartFooterStyles.footerValue}>{formatShortDate(first.dateISO, locale)}</Text>
      </View>
      <View>
        <Text style={chartFooterStyles.footerLabel}>{texts.chart.latest}</Text>
        <Text style={chartFooterStyles.footerValue}>{formatShortDate(last.dateISO, locale)}</Text>
      </View>
      <View>
        <Text style={chartFooterStyles.footerLabel}>{texts.chart.latest}</Text>
        <Text style={chartFooterStyles.footerValue}>
          {last.weightKg.toFixed(1)} {texts.chart.unit}
        </Text>
      </View>
    </View>
  );
}
