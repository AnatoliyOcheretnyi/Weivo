export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const formatKg = (value: number) => {
  const fixed = value.toFixed(1);
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
};
