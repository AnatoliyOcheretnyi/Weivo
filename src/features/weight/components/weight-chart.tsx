import { useMemo, useRef } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import type { WeightEntry } from '../data/weight-mock';

const chartHeight = 220;
const barWidth = 6;
const barGap = 4;
const itemSize = barWidth + barGap;

const formatShortDate = (dateISO: string) =>
  new Date(dateISO).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

type WeightChartProps = {
  data: WeightEntry[];
};

export function WeightChart({ data }: WeightChartProps) {
  const listRef = useRef<FlatList<WeightEntry>>(null);
  const { min, max, first, last } = useMemo(() => {
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;
    for (const entry of data) {
      minValue = Math.min(minValue, entry.weightKg);
      maxValue = Math.max(maxValue, entry.weightKg);
    }
    return {
      min: minValue,
      max: maxValue,
      first: data[0],
      last: data[data.length - 1],
    };
  }, [data]);

  const range = Math.max(max - min, 1);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Weight Flow</Text>
          <Text style={styles.subtitle}>500 entries - daily log</Text>
        </View>
        <View style={styles.rangePill}>
          <Text style={styles.rangeText}>{min.toFixed(1)}-{max.toFixed(1)} kg</Text>
        </View>
      </View>

      <View style={styles.chartFrame}>
        <View style={styles.grid}>
          <View style={[styles.gridLine, { top: 0 }]} />
          <View style={[styles.gridLine, { top: chartHeight * 0.33 }]} />
          <View style={[styles.gridLine, { top: chartHeight * 0.66 }]} />
          <View style={[styles.gridLine, { top: chartHeight }]} />
        </View>

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
            const normalized = (item.weightKg - min) / range;
            const height = 12 + normalized * (chartHeight - 24);
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5EFE7',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#1B1B1B',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.select({ ios: 'Avenir Next', android: 'serif', default: 'Avenir Next' }),
    color: '#1B1B1B',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#5D4B3A',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  rangePill: {
    backgroundColor: '#101010',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  rangeText: {
    color: '#F6F0E9',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chartFrame: {
    marginTop: 20,
    height: chartHeight + 24,
    borderRadius: 20,
    backgroundColor: '#FAF7F2',
    paddingVertical: 12,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    height: chartHeight,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5DBCF',
  },
  chartContent: {
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  trailingSpacer: {
    width: 56,
  },
  barSlot: {
    width: itemSize,
    height: chartHeight,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: barWidth,
    borderRadius: 6,
  },
  currentDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#101010',
  },
  currentGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: 'rgba(16,16,16,0.12)',
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#9A7E69',
  },
  footerValue: {
    marginTop: 4,
    fontSize: 13,
    color: '#1B1B1B',
  },
});
