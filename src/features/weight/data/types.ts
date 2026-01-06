export type Mood = 'happy' | 'neutral' | 'sad' | 'angry';
export type WeightEntry = {
  dateISO: string;
  weightKg: number;
  mood?: Mood;
};
