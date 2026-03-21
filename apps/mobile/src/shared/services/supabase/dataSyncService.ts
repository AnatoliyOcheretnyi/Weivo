import type { User } from '@supabase/supabase-js'
import type { ProfileData } from '@/features/profile'
import type { GoalSegment, WeightEntry } from '@/features/weight'
import { supabase } from './client'

type BootstrapPayload = {
  profile: ProfileData
  entries: WeightEntry[]
  segments: GoalSegment[]
}

type ProfileRow = {
  id: string
  email: string | null
  username: string | null
  avatar_url: string | null
  has_seen_welcome: boolean | null
  birth_date_iso: string | null
  sex: string | null
  height_cm: number | null
  activity_level: string | null
  goal_type: string | null
  goal_target_kg: number | null
  goal_rate_kg_per_week: number | null
  goal_range_min_kg: number | null
  goal_range_max_kg: number | null
  units: string | null
  language: string | null
  theme: string | null
  onboarding_complete: boolean | null
  has_seen_segments_hint: boolean | null
  latest_weight_kg: number | null
  bmi: number | null
  calories_maintenance: number | null
  calories_target: number | null
  eta_weeks: number | null
}

type WeightEntryRow = {
  user_id: string
  date_iso: string
  weight_kg: number
  mood: string | null
  updated_at: string
}

type GoalSegmentRow = {
  id: string
  user_id: string
  start_kg: number
  target_kg: number
  direction: string
  note: string | null
  created_at_iso: string
  completed_at_iso: string | null
  updated_at: string
}

const CALORIES_PER_KG = 7700
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

const calculateAge = (dateISO: string) => {
  const birth = new Date(dateISO)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDelta = today.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return Math.max(0, age)
}

const compactProfile = (profile: ProfileData): ProfileData => {
  const next: ProfileData = {}
  for (const [key, value] of Object.entries(profile)) {
    if (value !== undefined) {
      ;(next as Record<string, unknown>)[key] = value
    }
  }
  return next
}

const scoreProfile = (profile: ProfileData) =>
  [
    profile.birthDateISO,
    profile.username,
    profile.sex,
    profile.heightCm,
    profile.activityLevel,
    profile.goalType,
    profile.units,
    profile.language,
    profile.theme,
    profile.onboardingComplete,
    profile.hasSeenWelcome,
    profile.goalTargetKg,
    profile.goalRateKgPerWeek,
    profile.goalRangeMinKg,
    profile.goalRangeMaxKg,
  ].filter((value) => value !== undefined && value !== null && value !== '').length

const getLatestWeight = (entries: WeightEntry[]) => {
  if (entries.length === 0) {
    return null
  }
  const sorted = [...entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  return sorted[sorted.length - 1]?.weightKg ?? null
}

const computeDerivedMetrics = (profile: ProfileData, entries: WeightEntry[]) => {
  const latestWeight = getLatestWeight(entries)
  const heightCm = profile.heightCm ?? null
  const birthDateISO = profile.birthDateISO ?? null
  const sex = profile.sex ?? null
  const activityLevel = profile.activityLevel ?? 'sedentary'
  const goalType = profile.goalType ?? 'maintain'
  const goalRateKgPerWeek = profile.goalRateKgPerWeek ?? null
  const goalTargetKg = profile.goalTargetKg ?? null
  const goalRangeMinKg = profile.goalRangeMinKg ?? null
  const goalRangeMaxKg = profile.goalRangeMaxKg ?? null

  const bmi =
    latestWeight && heightCm ? Number((latestWeight / Math.pow(heightCm / 100, 2)).toFixed(2)) : null

  let caloriesMaintenance: number | null = null
  let caloriesTarget: number | null = null
  if (latestWeight && heightCm && birthDateISO && sex) {
    const age = calculateAge(birthDateISO)
    const sexOffset = sex === 'male' ? 5 : -161
    const bmr = 10 * latestWeight + 6.25 * heightCm - 5 * age + sexOffset
    const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2
    const tdee = bmr * activityMultiplier
    caloriesMaintenance = Math.round(tdee)
    if ((goalType === 'lose' || goalType === 'gain') && goalRateKgPerWeek) {
      const delta = (goalRateKgPerWeek * CALORIES_PER_KG) / 7
      caloriesTarget = Math.round(goalType === 'lose' ? tdee - delta : tdee + delta)
    } else {
      caloriesTarget = Math.round(tdee)
    }
  }

  let etaWeeks: number | null = null
  if (latestWeight && goalRateKgPerWeek && goalRateKgPerWeek > 0) {
    if (goalType === 'maintain' && goalRangeMinKg != null && goalRangeMaxKg != null) {
      const target = latestWeight < goalRangeMinKg ? goalRangeMinKg : goalRangeMaxKg
      etaWeeks =
        latestWeight >= goalRangeMinKg && latestWeight <= goalRangeMaxKg
          ? 0
          : Math.ceil(Math.abs(latestWeight - target) / goalRateKgPerWeek)
    } else if ((goalType === 'lose' || goalType === 'gain') && goalTargetKg != null) {
      etaWeeks = Math.ceil(Math.abs(latestWeight - goalTargetKg) / goalRateKgPerWeek)
    }
  }

  return {
    latestWeightKg: latestWeight,
    bmi,
    caloriesMaintenance,
    caloriesTarget,
    etaWeeks,
  }
}

const toProfileMetricPatch = (
  metrics: ReturnType<typeof computeDerivedMetrics>
): Pick<
  ProfileData,
  'latestWeightKg' | 'bmi' | 'caloriesMaintenance' | 'caloriesTarget' | 'etaWeeks'
> => ({
  latestWeightKg: metrics.latestWeightKg ?? undefined,
  bmi: metrics.bmi ?? undefined,
  caloriesMaintenance: metrics.caloriesMaintenance ?? undefined,
  caloriesTarget: metrics.caloriesTarget ?? undefined,
  etaWeeks: metrics.etaWeeks ?? undefined,
})

const mapProfileRowToLocal = (row: ProfileRow | null): ProfileData => {
  if (!row) {
    return {}
  }
  return compactProfile({
    email: row.email ?? undefined,
    username: row.username ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    hasSeenWelcome: row.has_seen_welcome ?? undefined,
    birthDateISO: row.birth_date_iso ?? undefined,
    sex: row.sex as ProfileData['sex'],
    heightCm: row.height_cm ?? undefined,
    activityLevel: row.activity_level as ProfileData['activityLevel'],
    goalType: row.goal_type as ProfileData['goalType'],
    goalTargetKg: row.goal_target_kg ?? undefined,
    goalRateKgPerWeek: row.goal_rate_kg_per_week ?? undefined,
    goalRangeMinKg: row.goal_range_min_kg ?? undefined,
    goalRangeMaxKg: row.goal_range_max_kg ?? undefined,
    units: row.units as ProfileData['units'],
    language: row.language as ProfileData['language'],
    theme: row.theme as ProfileData['theme'],
    onboardingComplete: row.onboarding_complete ?? undefined,
    hasSeenSegmentsHint: row.has_seen_segments_hint ?? undefined,
    latestWeightKg: row.latest_weight_kg ?? undefined,
    bmi: row.bmi ?? undefined,
    caloriesMaintenance: row.calories_maintenance ?? undefined,
    caloriesTarget: row.calories_target ?? undefined,
    etaWeeks: row.eta_weeks ?? undefined,
  })
}

const mergeProfiles = (localProfile: ProfileData, remoteProfile: ProfileData): ProfileData => {
  const local = compactProfile(localProfile)
  const remote = compactProfile(remoteProfile)
  const localScore = scoreProfile(local)
  const remoteScore = scoreProfile(remote)
  const primary = localScore >= remoteScore ? local : remote
  const secondary = localScore >= remoteScore ? remote : local
  return compactProfile({
    ...secondary,
    ...primary,
    hasSeenWelcome: Boolean(local.hasSeenWelcome || remote.hasSeenWelcome),
    onboardingComplete: Boolean(local.onboardingComplete || remote.onboardingComplete),
    hasSeenSegmentsHint: Boolean(local.hasSeenSegmentsHint || remote.hasSeenSegmentsHint),
  })
}

const dedupeEntries = (entries: WeightEntry[]) => {
  const map = new Map<string, WeightEntry>()
  for (const entry of entries) {
    map.set(entry.dateISO, entry)
  }
  return [...map.values()].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
}

const mergeEntries = (localEntries: WeightEntry[], remoteEntries: WeightEntry[]) =>
  dedupeEntries([...remoteEntries, ...localEntries])

const dedupeSegments = (segments: GoalSegment[]) => {
  const map = new Map<string, GoalSegment>()
  for (const segment of segments) {
    map.set(segment.id, segment)
  }
  return [...map.values()].sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO))
}

const mergeSegments = (localSegments: GoalSegment[], remoteSegments: GoalSegment[]) =>
  dedupeSegments([...remoteSegments, ...localSegments])

const mapEntryRowsToLocal = (rows: WeightEntryRow[]): WeightEntry[] =>
  rows
    .map((row) => ({
      dateISO: row.date_iso,
      weightKg: Number(row.weight_kg),
      mood: row.mood ? (row.mood as WeightEntry['mood']) : undefined,
    }))
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))

const mapSegmentRowsToLocal = (rows: GoalSegmentRow[]): GoalSegment[] =>
  rows
    .map((row) => ({
      id: row.id,
      startKg: Number(row.start_kg),
      targetKg: Number(row.target_kg),
      direction: row.direction as GoalSegment['direction'],
      note: row.note ?? undefined,
      createdAtISO: row.created_at_iso,
      completedAtISO: row.completed_at_iso ?? undefined,
    }))
    .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO))

const getUserProfileSeed = (user: User) => {
  const fullName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
    null
  const avatarUrl =
    (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) || null
  return {
    email: user.email ?? null,
    username: fullName,
    avatar_url: avatarUrl,
  }
}

const mapProfileToRow = (profile: ProfileData, entries: WeightEntry[], user: User) => {
  const metrics = computeDerivedMetrics(profile, entries)
  const seed = getUserProfileSeed(user)
  const normalizedUsername = profile.username?.trim() ? profile.username.trim() : null
  return {
    id: user.id,
    email: seed.email,
    username: normalizedUsername ?? seed.username,
    avatar_url: seed.avatar_url,
    has_seen_welcome: profile.hasSeenWelcome ?? false,
    birth_date_iso: profile.birthDateISO ?? null,
    sex: profile.sex ?? null,
    height_cm: profile.heightCm ?? null,
    activity_level: profile.activityLevel ?? null,
    goal_type: profile.goalType ?? null,
    goal_target_kg: profile.goalTargetKg ?? null,
    goal_rate_kg_per_week: profile.goalRateKgPerWeek ?? null,
    goal_range_min_kg: profile.goalRangeMinKg ?? null,
    goal_range_max_kg: profile.goalRangeMaxKg ?? null,
    units: profile.units ?? null,
    language: profile.language ?? null,
    theme: profile.theme ?? null,
    onboarding_complete: profile.onboardingComplete ?? false,
    has_seen_segments_hint: profile.hasSeenSegmentsHint ?? false,
    latest_weight_kg: metrics.latestWeightKg,
    bmi: metrics.bmi,
    calories_maintenance: metrics.caloriesMaintenance,
    calories_target: metrics.caloriesTarget,
    eta_weeks: metrics.etaWeeks,
    updated_at: new Date().toISOString(),
  }
}

const ensureProfileRow = async (user: User) => {
  const seed = getUserProfileSeed(user)
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: seed.email,
      avatar_url: seed.avatar_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )
  if (error) {
    console.error('Failed to ensure profile row in Supabase', error)
  }
}

const getSignedInUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Failed to fetch Supabase user', error)
    return null
  }
  return user
}

const fetchRemotePayload = async (userId: string) => {
  const [profileResult, entriesResult, segmentsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle<ProfileRow>(),
    supabase
      .from('weight_entries')
      .select('user_id,date_iso,weight_kg,mood,updated_at')
      .eq('user_id', userId)
      .order('date_iso', { ascending: true })
      .returns<WeightEntryRow[]>(),
    supabase
      .from('goal_segments')
      .select('id,user_id,start_kg,target_kg,direction,note,created_at_iso,completed_at_iso,updated_at')
      .eq('user_id', userId)
      .order('created_at_iso', { ascending: false })
      .returns<GoalSegmentRow[]>(),
  ])

  if (profileResult.error) {
    console.error('Failed to load profile from Supabase', profileResult.error)
  }
  if (entriesResult.error) {
    console.error('Failed to load entries from Supabase', entriesResult.error)
  }
  if (segmentsResult.error) {
    console.error('Failed to load goal segments from Supabase', segmentsResult.error)
  }

  return {
    profile: mapProfileRowToLocal(profileResult.data ?? null),
    entries: mapEntryRowsToLocal(entriesResult.data ?? []),
    segments: mapSegmentRowsToLocal(segmentsResult.data ?? []),
  }
}

const syncWeightEntries = async (userId: string, entries: WeightEntry[]) => {
  const now = new Date().toISOString()
  const normalized = dedupeEntries(entries)
  const payload = normalized.map((entry) => ({
    user_id: userId,
    date_iso: entry.dateISO,
    created_at: entry.dateISO,
    weight_kg: entry.weightKg,
    mood: entry.mood ?? null,
    updated_at: now,
  }))

  if (payload.length > 0) {
    const { error: upsertError } = await supabase
      .from('weight_entries')
      .upsert(payload, { onConflict: 'user_id,date_iso' })
    if (upsertError) {
      console.error('Failed to sync weight entries to Supabase', upsertError)
      return
    }
  }

  const { data: remoteRows, error: remoteError } = await supabase
    .from('weight_entries')
    .select('date_iso')
    .eq('user_id', userId)
  if (remoteError) {
    console.error('Failed to fetch remote entries before cleanup', remoteError)
    return
  }

  const localSet = new Set(normalized.map((entry) => entry.dateISO))
  const toDelete = (remoteRows ?? [])
    .map((row) => row.date_iso as string)
    .filter((dateISO) => !localSet.has(dateISO))

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('weight_entries')
      .delete()
      .eq('user_id', userId)
      .in('date_iso', toDelete)
    if (deleteError) {
      console.error('Failed to delete stale weight entries from Supabase', deleteError)
    }
  }
}

const syncGoalSegments = async (userId: string, segments: GoalSegment[]) => {
  const now = new Date().toISOString()
  const normalized = dedupeSegments(segments)
  const payload = normalized.map((segment) => ({
    id: segment.id,
    user_id: userId,
    start_kg: segment.startKg,
    target_kg: segment.targetKg,
    direction: segment.direction,
    note: segment.note ?? null,
    created_at_iso: segment.createdAtISO,
    completed_at_iso: segment.completedAtISO ?? null,
    updated_at: now,
  }))

  if (payload.length > 0) {
    const { error: upsertError } = await supabase.from('goal_segments').upsert(payload)
    if (upsertError) {
      console.error('Failed to sync goal segments to Supabase', upsertError)
      return
    }
  }

  const { data: remoteRows, error: remoteError } = await supabase
    .from('goal_segments')
    .select('id')
    .eq('user_id', userId)
  if (remoteError) {
    console.error('Failed to fetch remote goal segments before cleanup', remoteError)
    return
  }

  const localSet = new Set(normalized.map((segment) => segment.id))
  const toDelete = (remoteRows ?? [])
    .map((row) => row.id as string)
    .filter((id) => !localSet.has(id))

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('goal_segments')
      .delete()
      .eq('user_id', userId)
      .in('id', toDelete)
    if (deleteError) {
      console.error('Failed to delete stale goal segments from Supabase', deleteError)
    }
  }
}

const pushAllForUser = async (user: User, payload: BootstrapPayload) => {
  const profileRow = mapProfileToRow(payload.profile, payload.entries, user)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profileRow, { onConflict: 'id' })
  if (profileError) {
    console.error('Failed to sync profile to Supabase', profileError)
  }

  await Promise.all([
    syncWeightEntries(user.id, payload.entries),
    syncGoalSegments(user.id, payload.segments),
  ])
}

export const dataSyncService = {
  async bootstrap(local: BootstrapPayload): Promise<BootstrapPayload | null> {
    const user = await getSignedInUser()
    if (!user) {
      return null
    }
    await ensureProfileRow(user)

    const remote = await fetchRemotePayload(user.id)
    const mergedProfile = mergeProfiles(local.profile, remote.profile)
    const mergedEntries = mergeEntries(local.entries, remote.entries)
    const mergedSegments = mergeSegments(local.segments, remote.segments)

    const mergedPayload: BootstrapPayload = {
      profile: {
        ...mergedProfile,
        ...toProfileMetricPatch(computeDerivedMetrics(mergedProfile, mergedEntries)),
      },
      entries: mergedEntries,
      segments: mergedSegments,
    }

    await pushAllForUser(user, mergedPayload)
    return mergedPayload
  },

  async syncFromLocal(local: BootstrapPayload) {
    const user = await getSignedInUser()
    if (!user) {
      return
    }
    await ensureProfileRow(user)
    await pushAllForUser(user, {
      ...local,
      profile: {
        ...local.profile,
        ...toProfileMetricPatch(computeDerivedMetrics(local.profile, local.entries)),
      },
    })
  },
}
