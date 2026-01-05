import type { GoalSegment } from '../../data/goal-segments/types';

export type GoalSegmentTrackProps = {
  segments: GoalSegment[];
  currentKg?: number;
};
