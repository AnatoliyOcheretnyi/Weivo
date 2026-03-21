import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useMemo } from 'react'
import { profileStorage } from './profileStorage'
import type { ProfileData } from './types'
type ProfileStore = {
  profile: ProfileData;
  updateProfile: (_next: Partial<ProfileData>) => void;
  replaceProfile: (_next: ProfileData) => void;
};
const profileAtom = atom<ProfileData>(profileStorage.loadProfile() ?? {})
const updateProfileAtom = atom(null, (get, set, next: Partial<ProfileData>) => {
  const merged = { ...get(profileAtom), ...next }
  profileStorage.saveProfile(merged)
  set(profileAtom, merged)
})
const replaceProfileAtom = atom(null, (_get, set, next: ProfileData) => {
  profileStorage.saveProfile(next)
  set(profileAtom, next)
})
export function useProfileStore() {
  const profile = useAtomValue(profileAtom)
  const updateProfile = useSetAtom(updateProfileAtom)
  const replaceProfile = useSetAtom(replaceProfileAtom)
  return useMemo<ProfileStore>(
    () => ({ profile, updateProfile, replaceProfile }),
    [profile, replaceProfile, updateProfile]
  )
}
