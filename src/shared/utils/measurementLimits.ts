export const WEIGHT_MIN_KG = 20
export const WEIGHT_MAX_KG = 300
export const HEIGHT_MIN_CM = 80
export const HEIGHT_MAX_CM = 250
export const GOAL_NOTE_MAX_LENGTH = 80
const GOAL_TARGET_MIN_FACTOR = 0.5
const GOAL_TARGET_MAX_FACTOR = 1.5
export const getHealthyTargetRangeKg = (currentKg: number) => ({
  min: Math.max(WEIGHT_MIN_KG, currentKg * GOAL_TARGET_MIN_FACTOR),
  max: Math.min(WEIGHT_MAX_KG, currentKg * GOAL_TARGET_MAX_FACTOR),
})
export const isWithinRange = (value: number, min: number, max: number) =>
  value >= min && value <= max
