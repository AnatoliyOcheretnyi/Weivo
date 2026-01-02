import { Text, View } from 'react-native';

import type { ChartFooterProps } from './types';
import { chartFooterStyles } from '@/theme/styles/weight-chart/chart-footer';
import { texts } from '@/texts';
import { formatShortDate } from '../utils';

export function ChartFooter({ first, last }: ChartFooterProps) {
  return (
    <View style={chartFooterStyles.footerRow}>
      <View>
        <Text style={chartFooterStyles.footerLabel}>{texts.chart.start}</Text>
        <Text style={chartFooterStyles.footerValue}>{formatShortDate(first.dateISO)}</Text>
      </View>
      <View>
        <Text style={chartFooterStyles.footerLabel}>{texts.chart.latest}</Text>
        <Text style={chartFooterStyles.footerValue}>{formatShortDate(last.dateISO)}</Text>
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
