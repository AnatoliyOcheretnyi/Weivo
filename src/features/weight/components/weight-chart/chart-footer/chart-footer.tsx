import { Text, View } from 'react-native';

import type { ChartFooterProps } from './types';
import { chartFooterStyles } from './chart-footer.styles';
import { useTexts } from '@/i18n';
import { formatShortDate } from '../utils';

export function ChartFooter({ first, last }: ChartFooterProps) {
  const { texts, locale } = useTexts();
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
