import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { weightEntries } from './weight-mock';
import type { Mood, WeightEntry } from './weight-mock';

type WeightStore = {
  entries: WeightEntry[];
  addEntry: (weightKg: number, mood?: Mood) => void;
};

const WeightContext = createContext<WeightStore | null>(null);

export function WeightProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WeightEntry[]>(weightEntries);

  const addEntry = useCallback((weightKg: number, mood?: Mood) => {
    setEntries((prev) => [
      ...prev,
      {
        dateISO: new Date().toISOString(),
        weightKg,
        mood,
      },
    ]);
  }, []);

  const value = useMemo(() => ({ entries, addEntry }), [entries, addEntry]);

  return <WeightContext.Provider value={value}>{children}</WeightContext.Provider>;
}

export function useWeightStore() {
  const context = useContext(WeightContext);
  if (!context) {
    throw new Error('useWeightStore must be used inside WeightProvider');
  }
  return context;
}
