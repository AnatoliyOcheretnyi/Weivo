import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

import { weightEntries } from './weight-mock';
import type { Mood, WeightEntry } from './weight-mock';
import { weightStorage } from './weight-storage';

type WeightStore = {
  entries: WeightEntry[];
  addEntry: (weightKg: number, mood?: Mood) => void;
  removeEntry: (dateISO: string) => void;
  clearEntries: () => void;
};

const entriesAtom = atom<WeightEntry[]>(weightStorage.loadEntries() ?? weightEntries);

const addEntryAtom = atom(null, (get, set, payload: { weightKg: number; mood?: Mood }) => {
  const entry: WeightEntry = {
    dateISO: new Date().toISOString(),
    weightKg: payload.weightKg,
    mood: payload.mood,
  };
  const next = weightStorage.addEntry(entry, get(entriesAtom));
  set(entriesAtom, next);
});

const removeEntryAtom = atom(null, (get, set, dateISO: string) => {
  const next = weightStorage.removeEntry(dateISO, get(entriesAtom));
  set(entriesAtom, next);
});

const clearEntriesAtom = atom(null, (_get, set) => {
  const next = weightStorage.clearEntries();
  set(entriesAtom, next);
});

export function useWeightStore() {
  const entries = useAtomValue(entriesAtom);
  const addEntry = useSetAtom(addEntryAtom);
  const removeEntry = useSetAtom(removeEntryAtom);
  const clearEntries = useSetAtom(clearEntriesAtom);

  return useMemo<WeightStore>(
    () => ({
      entries,
      addEntry: (weightKg, mood) => addEntry({ weightKg, mood }),
      removeEntry,
      clearEntries,
    }),
    [entries, addEntry, removeEntry, clearEntries]
  );
}
