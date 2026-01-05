import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

import { goalSegmentsStorage } from './storage';
import type { GoalSegment } from './types';

type GoalSegmentsStore = {
  segments: GoalSegment[];
  addSegment: (segment: GoalSegment) => void;
  updateSegment: (segment: GoalSegment) => void;
  removeSegment: (id: string) => void;
  clearSegments: () => void;
};

const segmentsAtom = atom<GoalSegment[]>(goalSegmentsStorage.loadSegments());

const addSegmentAtom = atom(null, (get, set, segment: GoalSegment) => {
  const next = goalSegmentsStorage.addSegment(segment, get(segmentsAtom));
  set(segmentsAtom, next);
});

const updateSegmentAtom = atom(null, (get, set, segment: GoalSegment) => {
  const next = goalSegmentsStorage.updateSegment(segment, get(segmentsAtom));
  set(segmentsAtom, next);
});

const removeSegmentAtom = atom(null, (get, set, id: string) => {
  const next = goalSegmentsStorage.removeSegment(id, get(segmentsAtom));
  set(segmentsAtom, next);
});

const clearSegmentsAtom = atom(null, (_get, set) => {
  const next = goalSegmentsStorage.clearSegments();
  set(segmentsAtom, next);
});

export function useGoalSegments() {
  const segments = useAtomValue(segmentsAtom);
  const addSegment = useSetAtom(addSegmentAtom);
  const updateSegment = useSetAtom(updateSegmentAtom);
  const removeSegment = useSetAtom(removeSegmentAtom);
  const clearSegments = useSetAtom(clearSegmentsAtom);

  return useMemo<GoalSegmentsStore>(
    () => ({ segments, addSegment, updateSegment, removeSegment, clearSegments }),
    [segments, addSegment, updateSegment, removeSegment, clearSegments]
  );
}
