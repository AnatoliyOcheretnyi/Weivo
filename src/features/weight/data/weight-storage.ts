import { createMMKV } from 'react-native-mmkv';

import type { WeightEntry } from './types';

const createStorage = () => {
  try {
    return createMMKV({ id: 'weivo' });
  } catch {
    return null;
  }
};

const storage = createStorage();
const ENTRIES_KEY = 'weight_entries_v1';

type StoredPayload = {
  entries: WeightEntry[];
};

export const weightStorage = {
  loadEntries(): WeightEntry[] | null {
    if (!storage) {
      return null;
    }
    const raw = storage.getString(ENTRIES_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as StoredPayload;
      if (!parsed || !Array.isArray(parsed.entries)) {
        return null;
      }
      return parsed.entries;
    } catch {
      return null;
    }
  },
  initEntries(defaultEntries: WeightEntry[]) {
    const existing = weightStorage.loadEntries();
    if (existing && existing.length > 0) {
      return existing;
    }
    weightStorage.saveEntries(defaultEntries);
    return defaultEntries;
  },
  saveEntries(entries: WeightEntry[]) {
    if (!storage) {
      return;
    }
    const payload: StoredPayload = { entries };
    storage.set(ENTRIES_KEY, JSON.stringify(payload));
  },
  addEntry(entry: WeightEntry, currentEntries?: WeightEntry[]) {
    const base = currentEntries ?? weightStorage.loadEntries() ?? [];
    const next = [...base, entry];
    weightStorage.saveEntries(next);
    return next;
  },
  removeEntry(dateISO: string, currentEntries?: WeightEntry[]) {
    const base = currentEntries ?? weightStorage.loadEntries() ?? [];
    const next = base.filter((entry) => entry.dateISO !== dateISO);
    weightStorage.saveEntries(next);
    return next;
  },
  clearEntries() {
    const next: WeightEntry[] = [];
    weightStorage.saveEntries(next);
    return next;
  },
};
