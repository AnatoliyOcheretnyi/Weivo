import type { ProfileData } from '@/features/profile'
import type { WeightEntry } from '@/features/weight'
const DAYS_IN_WEEK = 7
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const STABLE_WEEK_THRESHOLD_KG = 0.3
const average = (values: number[]) =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null
const averageTail = (values: number[], count: number) => {
  if (values.length === 0) {
    return null
  }
  const start = Math.max(values.length - count, 0)
  return average(values.slice(start))
}
const movingAverage = (values: number[], windowSize: number) => {
  if (values.length === 0) {
    return []
  }
  return values.map((_, index) => {
    const start = Math.max(index - windowSize + 1, 0)
    const window = values.slice(start, index + 1)
    const avg = average(window)
    return avg ?? values[index]
  })
}
const getDaysSpan = (entries: WeightEntry[]) => {
  if (entries.length < 2) {
    return 0
  }
  const first = new Date(entries[0].dateISO).getTime()
  const last = new Date(entries[entries.length - 1].dateISO).getTime()
  return Math.max(0, Math.round((last - first) / ONE_DAY_MS))
}
const addDays = (dateISO: string, days: number) =>
  new Date(new Date(dateISO).getTime() + days * ONE_DAY_MS).toISOString()
const getForecastDateISO = ({
  profile,
  latestWeight,
  weeklyRateKg,
  latestDateISO,
}: {
  profile: ProfileData;
  latestWeight: number | null;
  weeklyRateKg: number | null;
  latestDateISO: string | null;
}) => {
  if (latestWeight == null || weeklyRateKg == null || latestDateISO == null) {
    return null
  }
  if (Math.abs(weeklyRateKg) < 0.01) {
    return null
  }
  const goalType = profile.goalType ?? null
  if (goalType === 'lose' || goalType === 'gain') {
    const target = profile.goalTargetKg
    if (target == null) {
      return null
    }
    const delta = target - latestWeight
    if (goalType === 'lose' && weeklyRateKg >= 0) {
      return null
    }
    if (goalType === 'gain' && weeklyRateKg <= 0) {
      return null
    }
    const weeks = Math.abs(delta / weeklyRateKg)
    if (!Number.isFinite(weeks) || weeks < 0) {
      return null
    }
    return addDays(latestDateISO, Math.ceil(weeks * DAYS_IN_WEEK))
  }
  if (goalType === 'maintain') {
    const min = profile.goalRangeMinKg
    const max = profile.goalRangeMaxKg
    if (min == null || max == null) {
      return null
    }
    if (latestWeight >= min && latestWeight <= max) {
      return latestDateISO
    }
    const target = latestWeight < min ? min : max
    const delta = target - latestWeight
    if ((delta > 0 && weeklyRateKg <= 0) || (delta < 0 && weeklyRateKg >= 0)) {
      return null
    }
    const weeks = Math.abs(delta / weeklyRateKg)
    if (!Number.isFinite(weeks) || weeks < 0) {
      return null
    }
    return addDays(latestDateISO, Math.ceil(weeks * DAYS_IN_WEEK))
  }
  return null
}
export type AnalyticsStats = {
  entriesCount: number;
  currentKg: number | null;
  trendKg: number | null;
  avg7Kg: number | null;
  avg30Kg: number | null;
  weeklyRateKg: number | null;
  trendDeltaKg: number | null;
  largestWeeklyDropKg: number | null;
  largestRollbackKg: number | null;
  stableWeeks: number;
  forecastDateISO: string | null;
}
export const getAnalyticsStats = (entries: WeightEntry[], profile: ProfileData): AnalyticsStats => {
  if (entries.length === 0) {
    return {
      entriesCount: 0,
      currentKg: null,
      trendKg: null,
      avg7Kg: null,
      avg30Kg: null,
      weeklyRateKg: null,
      trendDeltaKg: null,
      largestWeeklyDropKg: null,
      largestRollbackKg: null,
      stableWeeks: 0,
      forecastDateISO: null,
    }
  }
  const ordered = [...entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  const weights = ordered.map((entry) => entry.weightKg)
  const trendSeries = movingAverage(weights, DAYS_IN_WEEK)
  const currentKg = weights[weights.length - 1]
  const trendKg = trendSeries[trendSeries.length - 1] ?? currentKg
  const avg7Kg = averageTail(weights, 7)
  const avg30Kg = averageTail(weights, 30)
  const daysSpan = getDaysSpan(ordered)
  const weeklyRateKg =
    daysSpan > 0 ? ((currentKg - weights[0]) / daysSpan) * DAYS_IN_WEEK : null
  const trendDeltaKg = currentKg - trendKg
  let minWeeklyDelta = Number.POSITIVE_INFINITY
  for (let index = DAYS_IN_WEEK; index < weights.length; index += 1) {
    const delta = weights[index] - weights[index - DAYS_IN_WEEK]
    if (delta < minWeeklyDelta) {
      minWeeklyDelta = delta
    }
  }
  const largestWeeklyDropKg =
    minWeeklyDelta !== Number.POSITIVE_INFINITY && minWeeklyDelta < 0
      ? Math.abs(minWeeklyDelta)
      : null
  let maxRollback = 0
  for (let index = 1; index < weights.length; index += 1) {
    const delta = weights[index] - weights[index - 1]
    if (delta > maxRollback) {
      maxRollback = delta
    }
  }
  const largestRollbackKg = maxRollback > 0 ? maxRollback : null
  let stableWeeks = 0
  for (let start = 0; start + DAYS_IN_WEEK < weights.length; start += DAYS_IN_WEEK) {
    const weekDelta = weights[start + DAYS_IN_WEEK] - weights[start]
    if (Math.abs(weekDelta) <= STABLE_WEEK_THRESHOLD_KG) {
      stableWeeks += 1
    }
  }
  const latestDateISO = ordered[ordered.length - 1]?.dateISO ?? null
  const forecastDateISO = getForecastDateISO({
    profile,
    latestWeight: currentKg,
    weeklyRateKg,
    latestDateISO,
  })
  return {
    entriesCount: weights.length,
    currentKg,
    trendKg,
    avg7Kg,
    avg30Kg,
    weeklyRateKg,
    trendDeltaKg,
    largestWeeklyDropKg,
    largestRollbackKg,
    stableWeeks,
    forecastDateISO,
  }
}
