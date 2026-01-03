export type GoalType = 'lose' | 'gain' | 'maintain';
export type Units = 'metric' | 'imperial';
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Language = 'system' | 'en' | 'uk' | 'es';

export type ProfileData = {
  birthDateISO?: string;
  sex?: Sex;
  heightCm?: number;
  activityLevel?: ActivityLevel;
  goalType?: GoalType;
  goalTargetKg?: number;
  goalRateKgPerWeek?: number;
  goalRangeMinKg?: number;
  goalRangeMaxKg?: number;
  units?: Units;
  language?: Language;
};
