import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useMemo } from 'react'
import type { Mood, WeightEntry } from './types'
import { weightStorage } from './weightStorage'
import { weightEntries } from '../dev/weight-mock'
type WeightStore = {
  entries: WeightEntry[];
  addEntry: (_weightKg: number, _mood?: Mood) => void;
  removeEntry: (_dateISO: string) => void;
  clearEntries: () => void;
  replaceEntries: (_entries: WeightEntry[]) => void;
  seedDevEntries: () => void;
};
const entriesAtom = atom<WeightEntry[]>(weightStorage.loadEntries() ?? [])
const addEntryAtom = atom(null, (get, set, payload: { weightKg: number; mood?: Mood }) => {
  const entry: WeightEntry = {
    dateISO: new Date().toISOString(),
    weightKg: payload.weightKg,
    mood: payload.mood,
  }
  const next = weightStorage.addEntry(entry, get(entriesAtom))
  set(entriesAtom, next)
})
const removeEntryAtom = atom(null, (get, set, dateISO: string) => {
  const next = weightStorage.removeEntry(dateISO, get(entriesAtom))
  set(entriesAtom, next)
})
const clearEntriesAtom = atom(null, (_get, set) => {
  const next = weightStorage.clearEntries()
  set(entriesAtom, next)
})
const replaceEntriesAtom = atom(null, (_get, set, entries: WeightEntry[]) => {
  const next = weightStorage.replaceEntries(entries)
  set(entriesAtom, next)
})
const seedDevEntriesAtom = atom(null, (_get, set) => {
  const next = weightStorage.replaceEntries(weightEntries)
  set(entriesAtom, next)
})
export function useWeightStore() {
  const entries = useAtomValue(entriesAtom)
  const addEntry = useSetAtom(addEntryAtom)
  const removeEntry = useSetAtom(removeEntryAtom)
  const clearEntries = useSetAtom(clearEntriesAtom)
  const replaceEntries = useSetAtom(replaceEntriesAtom)
  const seedDevEntries = useSetAtom(seedDevEntriesAtom)
  return useMemo<WeightStore>(
    () => ({
      entries,
      addEntry: (weightKg, mood) => addEntry({ weightKg, mood }),
      removeEntry,
      clearEntries,
      replaceEntries,
      seedDevEntries,
    }),
    [entries, addEntry, clearEntries, removeEntry, replaceEntries, seedDevEntries]
  )
}
