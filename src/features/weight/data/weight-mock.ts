export type Mood = 'happy' | 'neutral' | 'sad' | 'angry';

export type WeightEntry = {
  dateISO: string;
  weightKg: number;
  mood?: Mood;
};

const totalEntries = 500;

const segments = [
  { count: 160, from: 70, to: 95 },
  { count: 90, from: 95, to: 82 },
  { count: 170, from: 82, to: 130 },
  { count: 80, from: 130, to: 115.9 },
];

const seedRandom = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let result = Math.imul(t ^ (t >>> 15), t | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const rand = seedRandom(42);

const startDate = new Date();
startDate.setDate(startDate.getDate() - (totalEntries - 1));

const buildSegment = (count: number, from: number, to: number, offset: number) => {
  const output: WeightEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 1 : i / (count - 1);
    const base = from + (to - from) * t;
    const jitter = (rand() - 0.5) * 0.9 + Math.sin((offset + i) / 11) * 0.15;
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + offset + i);
    const moodRoll = rand();
    const mood: Mood | undefined =
      moodRoll > 0.82
        ? 'happy'
        : moodRoll > 0.74
          ? 'neutral'
          : moodRoll > 0.68
            ? 'sad'
            : moodRoll > 0.64
              ? 'angry'
              : undefined;

    output.push({
      dateISO: date.toISOString(),
      weightKg: Math.round((base + jitter) * 10) / 10,
      mood,
    });
  }
  return output;
};

const entries: WeightEntry[] = [];
let offset = 0;

for (const segment of segments) {
  entries.push(...buildSegment(segment.count, segment.from, segment.to, offset));
  offset += segment.count;
}

entries[entries.length - 1] = {
  ...entries[entries.length - 1],
  weightKg: 115.9,
};

export const weightEntries = entries;
