import { useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';

import type { WeightEntry } from '../../../data/weight-mock';
import { ChartFooter } from '../chart-footer';
import { ChartGrid } from '../chart-grid';
import { ChartHeader } from '../chart-header';
import { getBarHeight, getWeightStats } from '../utils';
import { barGap, barWidth, chartHeight, itemSize, styles } from './styles';
import type { WeightChartProps } from './types';

export function WeightChart({ data }: WeightChartProps) {
  const listRef = useRef<FlatList<WeightEntry>>(null);
  const { min, max, first, last } = useMemo(() => getWeightStats(data), [data]);

  const range = Math.max(max - min, 1);

  return (
    <View style={styles.card}>
      <ChartHeader min={min} max={max} total={data.length} />

      <View style={styles.chartFrame}>
        <ChartGrid height={chartHeight} />

        <FlatList
          ref={listRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.dateISO}
          contentContainerStyle={styles.chartContent}
          ListFooterComponent={<View style={styles.trailingSpacer} />}
          initialScrollIndex={Math.max(data.length - 1, 0)}
          initialNumToRender={80}
          windowSize={6}
          maxToRenderPerBatch={80}
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: false });
          }}
          getItemLayout={(_, index) => ({
            length: itemSize,
            offset: itemSize * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const height = getBarHeight(item.weightKg, min, range, chartHeight);
            const isLast = index === data.length - 1;

            return (
              <View style={styles.barSlot}>
                {isLast && <View style={[styles.currentGlow, { bottom: height - 10 }]} />}
                <View
                  style={[
                    styles.bar,
                    { height, backgroundColor: isLast ? '#101010' : '#C86B33' },
                  ]}
                />
                {isLast && <View style={[styles.currentDot, { bottom: height - 6 }]} />}
              </View>
            );
          }}
        />
      </View>

      <ChartFooter first={first} last={last} />
    </View>
  );
}

export { barGap, barWidth, chartHeight, itemSize };
