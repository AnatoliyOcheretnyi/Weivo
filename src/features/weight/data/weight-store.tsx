import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { weightEntries } from './weight-mock';
import type { Mood, WeightEntry } from './weight-mock';
import { weightStorage } from './weight-storage';

type WeightStore = {
  entries: WeightEntry[];
  addEntry: (weightKg: number, mood?: Mood) => void;
  removeEntry: (dateISO: string) => void;
  clearEntries: () => void;
};

const WeightContext = createContext<WeightStore | null>(null);

export function WeightProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WeightEntry[]>(
    () => weightStorage.loadEntries() ?? weightEntries
  );

  const addEntry = useCallback((weightKg: number, mood?: Mood) => {
    setEntries((prev) => {
      const entry = {
        dateISO: new Date().toISOString(),
        weightKg,
        mood,
      };
      return weightStorage.addEntry(entry, prev);
    });
  }, []);

  const removeEntry = useCallback((dateISO: string) => {
    setEntries((prev) => weightStorage.removeEntry(dateISO, prev));
  }, []);

  const clearEntries = useCallback(() => {
    setEntries(() => weightStorage.clearEntries());
  }, []);

  const value = useMemo(
    () => ({ entries, addEntry, removeEntry, clearEntries }),
    [entries, addEntry, removeEntry, clearEntries]
  );

  return <WeightContext.Provider value={value}>{children}</WeightContext.Provider>;
}

export function useWeightStore() {
  const context = useContext(WeightContext);
  if (!context) {
    throw new Error('useWeightStore must be used inside WeightProvider');
  }
  return context;
}
