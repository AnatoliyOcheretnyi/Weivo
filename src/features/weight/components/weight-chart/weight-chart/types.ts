import type { WeightEntry } from '../../../data/weight-mock';

export type WeightChartProps = {
  // Chronological entries for the chart, oldest to newest.
  data: WeightEntry[];
};
