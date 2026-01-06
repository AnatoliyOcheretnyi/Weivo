import { clamp } from '@/shared/utils';

export const exaggerateNormalized = (normalized: number, factor: number) => {
  'worklet';
  const centered = 0.5 + (normalized - 0.5) * factor;
  return clamp(centered, 0, 1);
};
