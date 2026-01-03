import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

import { profileStorage } from './profile-storage';
import type { ProfileData } from './types';

type ProfileStore = {
  profile: ProfileData;
  updateProfile: (next: Partial<ProfileData>) => void;
};

const profileAtom = atom<ProfileData>(profileStorage.loadProfile() ?? {});

const updateProfileAtom = atom(null, (get, set, next: Partial<ProfileData>) => {
  const merged = { ...get(profileAtom), ...next };
  profileStorage.saveProfile(merged);
  set(profileAtom, merged);
});

export function useProfileStore() {
  const profile = useAtomValue(profileAtom);
  const updateProfile = useSetAtom(updateProfileAtom);

  return useMemo<ProfileStore>(
    () => ({ profile, updateProfile }),
    [profile, updateProfile]
  );
}
