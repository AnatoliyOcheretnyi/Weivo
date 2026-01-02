import { Text, View } from 'react-native';

import type { ChartFooterProps } from './types';
import { styles } from './styles';
import { formatShortDate } from '../utils';

export function ChartFooter({ first, last }: ChartFooterProps) {
  return (
    <View style={styles.footerRow}>
      <View>
        <Text style={styles.footerLabel}>Start</Text>
        <Text style={styles.footerValue}>{formatShortDate(first.dateISO)}</Text>
      </View>
      <View>
        <Text style={styles.footerLabel}>Latest</Text>
        <Text style={styles.footerValue}>{formatShortDate(last.dateISO)}</Text>
      </View>
      <View>
        <Text style={styles.footerLabel}>Latest</Text>
        <Text style={styles.footerValue}>{last.weightKg.toFixed(1)} kg</Text>
      </View>
    </View>
  );
}
