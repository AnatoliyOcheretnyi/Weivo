export type GoalProgressProps = {
  currentKg: number;
  startKg: number;
  targetKg: number;
  showSuccess?: boolean;
  onSuccessComplete?: () => void;
};
