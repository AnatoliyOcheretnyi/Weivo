import { createMMKV } from 'react-native-mmkv';

import type { ProfileData } from './types';

const createStorage = () => {
  try {
    return createMMKV({ id: 'weivo' });
  } catch {
    return null;
  }
};

const storage = createStorage();
const PROFILE_KEY = 'profile_v1';

export const profileStorage = {
  loadProfile(): ProfileData | null {
    if (!storage) {
      return null;
    }
    const raw = storage.getString(PROFILE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as ProfileData;
    } catch {
      return null;
    }
  },
  saveProfile(profile: ProfileData) {
    if (!storage) {
      return;
    }
    storage.set(PROFILE_KEY, JSON.stringify(profile));
  },
};
