import { useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';

import type { WeightEntry } from '../../../data/weight-mock';
import { ChartFooter } from '../chart-footer';
import { ChartGrid } from '../chart-grid';
import { ChartHeader } from '../chart-header';
import { getBarHeight, getWeightStats } from '../utils';
import { colors, dimensions } from '@/theme';
import { weightChartStyles } from '@/theme/styles/weight-chart/weight-chart';
import type { WeightChartProps } from './types';

export function WeightChart({ data }: WeightChartProps) {
  const listRef = useRef<FlatList<WeightEntry>>(null);
  const { min, max, first, last } = useMemo(() => getWeightStats(data), [data]);

  const range = Math.max(max - min, 1);

  return (
    <View style={weightChartStyles.card}>
      <ChartHeader min={min} max={max} total={data.length} />

      <View style={weightChartStyles.chartFrame}>
        <ChartGrid height={dimensions.chart.height} />

        <FlatList
          ref={listRef}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.dateISO}
          contentContainerStyle={weightChartStyles.chartContent}
          ListFooterComponent={<View style={weightChartStyles.trailingSpacer} />}
          initialScrollIndex={Math.max(data.length - 1, 0)}
          initialNumToRender={80}
          windowSize={6}
          maxToRenderPerBatch={80}
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: false });
          }}
          getItemLayout={(_, index) => ({
            length: dimensions.chart.barWidth + dimensions.chart.barGap,
            offset: (dimensions.chart.barWidth + dimensions.chart.barGap) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const height = getBarHeight(item.weightKg, min, range, dimensions.chart.height);
            const isLast = index === data.length - 1;

            return (
              <View style={weightChartStyles.barSlot}>
                {isLast && (
                  <View
                    style={[
                      weightChartStyles.currentGlow,
                      { bottom: height - dimensions.chart.currentGlowOffset },
                    ]}
                  />
                )}
                <View
                  style={[
                    weightChartStyles.bar,
                    { height, backgroundColor: isLast ? colors.inkStrong : colors.accentOrange },
                  ]}
                />
                {isLast && (
                  <View
                    style={[
                      weightChartStyles.currentDot,
                      { bottom: height - dimensions.chart.currentDotOffset },
                    ]}
                  />
                )}
              </View>
            );
          }}
        />
      </View>

      <ChartFooter first={first} last={last} />
    </View>
  );
}

export const barGap = dimensions.chart.barGap;
export const barWidth = dimensions.chart.barWidth;
export const chartHeight = dimensions.chart.height;
export const itemSize = dimensions.chart.barWidth + dimensions.chart.barGap;
