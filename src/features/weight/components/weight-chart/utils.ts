import type { WeightEntry } from '../../data/weight-mock';

type WeightStats = {
  min: number;
  max: number;
  first: WeightEntry;
  last: WeightEntry;
};

export const formatShortDate = (dateISO: string) =>
  new Date(dateISO).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

export const getWeightStats = (data: WeightEntry[]): WeightStats => {
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
};

export const getBarHeight = (weightKg: number, min: number, range: number, maxHeight: number) => {
  const normalized = (weightKg - min) / range;
  return 12 + normalized * (maxHeight - 24);
};
