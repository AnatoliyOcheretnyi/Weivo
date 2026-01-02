export const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const exaggerateNormalized = (normalized: number, factor: number) => {
  'worklet';
  const centered = 0.5 + (normalized - 0.5) * factor;
  return clamp(centered, 0, 1);
};
