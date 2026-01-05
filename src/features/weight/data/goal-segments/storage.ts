import { createMMKV } from 'react-native-mmkv';

import type { GoalSegment } from './types';

const createStorage = () => {
  try {
    return createMMKV({ id: 'weivo' });
  } catch {
    return null;
  }
};

const storage = createStorage();
const SEGMENTS_KEY = 'goal_segments_v1';

type StoredPayload = {
  segments: GoalSegment[];
};

const loadPayload = (): StoredPayload | null => {
  if (!storage) {
    return null;
  }
  const raw = storage.getString(SEGMENTS_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredPayload;
  } catch {
    return null;
  }
};

const savePayload = (payload: StoredPayload) => {
  if (!storage) {
    return;
  }
  storage.set(SEGMENTS_KEY, JSON.stringify(payload));
};

export const goalSegmentsStorage = {
  loadSegments(): GoalSegment[] {
    return loadPayload()?.segments ?? [];
  },
  saveSegments(segments: GoalSegment[]) {
    savePayload({ segments });
  },
  addSegment(segment: GoalSegment, existing: GoalSegment[]) {
    const next = [segment, ...existing];
    savePayload({ segments: next });
    return next;
  },
  updateSegment(updated: GoalSegment, existing: GoalSegment[]) {
    const next = existing.map((segment) =>
      segment.id === updated.id ? updated : segment
    );
    savePayload({ segments: next });
    return next;
  },
  removeSegment(id: string, existing: GoalSegment[]) {
    const next = existing.filter((segment) => segment.id !== id);
    savePayload({ segments: next });
    return next;
  },
  clearSegments() {
    savePayload({ segments: [] });
    return [];
  },
};
