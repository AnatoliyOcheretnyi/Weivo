import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useMemo } from 'react'
import { goalSegmentsStorage } from './storage'
import type { GoalSegment } from './types'
type GoalSegmentsStore = {
  segments: GoalSegment[];
  addSegment: (_segment: GoalSegment) => void;
  updateSegment: (_segment: GoalSegment) => void;
  removeSegment: (_id: string) => void;
  clearSegments: () => void;
  reconcileCompletion: (_currentKg: number | null) => void;
};
const segmentsAtom = atom<GoalSegment[]>(goalSegmentsStorage.loadSegments())
const addSegmentAtom = atom(null, (get, set, segment: GoalSegment) => {
  const next = goalSegmentsStorage.addSegment(segment, get(segmentsAtom))
  set(segmentsAtom, next)
})
const updateSegmentAtom = atom(null, (get, set, segment: GoalSegment) => {
  const next = goalSegmentsStorage.updateSegment(segment, get(segmentsAtom))
  set(segmentsAtom, next)
})
const removeSegmentAtom = atom(null, (get, set, id: string) => {
  const next = goalSegmentsStorage.removeSegment(id, get(segmentsAtom))
  set(segmentsAtom, next)
})
const clearSegmentsAtom = atom(null, (_get, set) => {
  const next = goalSegmentsStorage.clearSegments()
  set(segmentsAtom, next)
})
const REVERT_TOLERANCE_KG = 1
const reconcileCompletionAtom = atom(null, (get, set, currentKg: number | null) => {
  if (currentKg == null) {
    return
  }
  const segments = get(segmentsAtom)
  if (segments.length === 0) {
    return
  }
  const ordered = [...segments].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO))
  const nextOpenIndex = ordered.findIndex((segment) => !segment.completedAtISO)
  const fallbackIndex = nextOpenIndex === -1 ? ordered.length - 1 : nextOpenIndex
  const nextOpen = ordered[fallbackIndex]
  const weightIndex = ordered.findIndex((segment) => {
    const min = Math.min(segment.startKg, segment.targetKg)
    const max = Math.max(segment.startKg, segment.targetKg)
    return currentKg >= min && currentKg <= max
  })
  let effectiveIndex = fallbackIndex
  if (nextOpen) {
    const overshoot =
      nextOpen.direction === 'gain'
        ? currentKg < nextOpen.startKg - REVERT_TOLERANCE_KG
        : currentKg > nextOpen.startKg + REVERT_TOLERANCE_KG
    if (overshoot && weightIndex !== -1) {
      effectiveIndex = weightIndex
    }
  }
  const idsToReset = new Set(ordered.slice(effectiveIndex).map((segment) => segment.id))
  const hasReset = segments.some(
    (segment) => idsToReset.has(segment.id) && segment.completedAtISO
  )
  if (!hasReset) {
    return
  }
  const next = segments.map((segment) =>
    idsToReset.has(segment.id) ? { ...segment, completedAtISO: undefined } : segment
  )
  goalSegmentsStorage.saveSegments(next)
  set(segmentsAtom, next)
})
export function useGoalSegments() {
  const segments = useAtomValue(segmentsAtom)
  const addSegment = useSetAtom(addSegmentAtom)
  const updateSegment = useSetAtom(updateSegmentAtom)
  const removeSegment = useSetAtom(removeSegmentAtom)
  const clearSegments = useSetAtom(clearSegmentsAtom)
  const reconcileCompletion = useSetAtom(reconcileCompletionAtom)
  return useMemo<GoalSegmentsStore>(
    () => ({
      segments,
      addSegment,
      updateSegment,
      removeSegment,
      clearSegments,
      reconcileCompletion,
    }),
    [segments, addSegment, updateSegment, removeSegment, clearSegments, reconcileCompletion]
  )
}
