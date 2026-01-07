export type Mood = 'happy' | 'neutral' | 'sad' | 'angry' | 'celebrate';
export type WeightEntry = {
  dateISO: string;
  weightKg: number;
  mood?: Mood;
};
