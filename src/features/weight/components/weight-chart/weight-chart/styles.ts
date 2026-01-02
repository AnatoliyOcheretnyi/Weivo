import { StyleSheet } from 'react-native';

export const chartHeight = 220;
export const barWidth = 6;
export const barGap = 4;
export const itemSize = barWidth + barGap;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5EFE7',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#1B1B1B',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  chartFrame: {
    marginTop: 20,
    height: chartHeight + 24,
    borderRadius: 20,
    backgroundColor: '#FAF7F2',
    paddingVertical: 12,
    overflow: 'hidden',
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
});
