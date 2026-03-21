import { dimensions } from '@/theme'
import type { WeightEntry } from '../../data/types'
type WeightStats = {
  min: number;
  max: number;
  first: WeightEntry;
  last: WeightEntry;
};
export const formatShortDate = (dateISO: string, locale: string) =>
  new Date(dateISO).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })
export const getWeightStats = (data: WeightEntry[]): WeightStats => {
  let minValue = Number.POSITIVE_INFINITY
  let maxValue = Number.NEGATIVE_INFINITY
  for (const entry of data) {
    minValue = Math.min(minValue, entry.weightKg)
    maxValue = Math.max(maxValue, entry.weightKg)
  }
  return {
    min: minValue,
    max: maxValue,
    first: data[0],
    last: data[data.length - 1],
  }
}
const getUtcDayIndex = (dateISO: string) => {
  const date = new Date(dateISO)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}
export const getDaysSpan = (data: WeightEntry[]) => {
  if (data.length === 0) {
    return 0
  }
  let minDay = getUtcDayIndex(data[0].dateISO)
  let maxDay = minDay
  for (const entry of data) {
    const dayIndex = getUtcDayIndex(entry.dateISO)
    minDay = Math.min(minDay, dayIndex)
    maxDay = Math.max(maxDay, dayIndex)
  }
  const days = Math.floor((maxDay - minDay) / (24 * 60 * 60 * 1000)) + 1
  return Math.max(days, 1)
}
export const getBarHeight = (weightKg: number, min: number, range: number, maxHeight: number) => {
  const normalized = (weightKg - min) / range
  return (
    dimensions.chart.barMinHeight +
    normalized * (maxHeight - dimensions.chart.barPadding)
  )
}
