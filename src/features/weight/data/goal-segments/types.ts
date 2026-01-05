export type GoalSegmentDirection = 'lose' | 'gain';

export type GoalSegment = {
  id: string;
  startKg: number;
  targetKg: number;
  direction: GoalSegmentDirection;
  note?: string;
  createdAtISO: string;
  completedAtISO?: string;
};
