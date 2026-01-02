import type { WeightEntry } from '../data/weight-mock';

export type SkiaWeightChartProps = {
  // Chronological entries for the chart, oldest to newest.
  data: WeightEntry[];
};
