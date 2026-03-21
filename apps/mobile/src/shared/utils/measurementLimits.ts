export const WEIGHT_MIN_KG = 20
export const WEIGHT_MAX_KG = 300
export const HEIGHT_MIN_CM = 80
export const HEIGHT_MAX_CM = 250
export const GOAL_NOTE_MAX_LENGTH = 80
const BMI_MIN = 18.5
const toMeters = (heightCm: number) => heightCm / 100
export const getHealthyTargetRangeKg = (_currentKg: number, heightCm?: number | null) => {
  if (!heightCm || heightCm <= 0) {
    return { min: WEIGHT_MIN_KG, max: WEIGHT_MAX_KG }
  }
  const heightM = toMeters(heightCm)
  const minByBmi = BMI_MIN * heightM * heightM
  return {
    min: Math.max(WEIGHT_MIN_KG, minByBmi),
    max: WEIGHT_MAX_KG,
  }
}
export const isWithinRange = (value: number, min: number, max: number) =>
  value >= min && value <= max
