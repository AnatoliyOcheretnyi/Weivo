import { Text, View } from 'react-native';

import type { ChartHeaderProps } from './types';
import { styles } from './styles';

export function ChartHeader({ min, max, total }: ChartHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View>
        <Text style={styles.title}>Weight Flow</Text>
        <Text style={styles.subtitle}>{total} entries - daily log</Text>
      </View>
      <View style={styles.rangePill}>
        <Text style={styles.rangeText}>{min.toFixed(1)}-{max.toFixed(1)} kg</Text>
      </View>
    </View>
  );
}
