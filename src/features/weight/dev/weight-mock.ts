import type { WeightEntry } from '../data/types';

const parseDateTime = (value: string) => {
  const [datePart, timePart] = value.split(' ');
  const [day, month, year] = datePart.split('.').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute).toISOString();
};

const rawEntries = [
  { weightKg: 129.4, dateTime: '06.06.2022 00:00' },
  { weightKg: 120.1, dateTime: '11.06.2022 10:53' },
  { weightKg: 119.3, dateTime: '16.06.2022 10:21' },
  { weightKg: 119.2, dateTime: '18.06.2022 11:36' },
  { weightKg: 118.8, dateTime: '24.06.2022 08:53' },
  { weightKg: 118.3, dateTime: '24.06.2022 10:16' },
  { weightKg: 117.9, dateTime: '26.06.2022 08:47' },
  { weightKg: 117.5, dateTime: '27.06.2022 09:25' },
  { weightKg: 117.0, dateTime: '03.07.2022 11:11' },
  { weightKg: 116.9, dateTime: '07.07.2022 18:20' },
  { weightKg: 116.2, dateTime: '08.07.2022 20:06' },
  { weightKg: 116.1, dateTime: '09.07.2022 10:59' },
  { weightKg: 116.0, dateTime: '11.07.2022 10:05' },
  { weightKg: 120.0, dateTime: '10.10.2022 13:01' },
  { weightKg: 117.8, dateTime: '21.10.2022 11:30' },
  { weightKg: 125.0, dateTime: '08.04.2023 16:52' },
  { weightKg: 126.1, dateTime: '30.05.2023 11:01' },
  { weightKg: 126.3, dateTime: '05.06.2023 10:18' },
  { weightKg: 131.5, dateTime: '11.03.2024 13:01' },
  { weightKg: 120.5, dateTime: '07.07.2024 13:02' },
  { weightKg: 121.7, dateTime: '08.07.2024 12:06' },
  { weightKg: 119.8, dateTime: '13.07.2024 13:18' },
  { weightKg: 118.6, dateTime: '14.07.2024 08:05' },
  { weightKg: 118.3, dateTime: '16.07.2024 07:13' },
  { weightKg: 118.0, dateTime: '18.07.2024 11:08' },
  { weightKg: 117.6, dateTime: '22.07.2024 14:40' },
  { weightKg: 117.4, dateTime: '27.07.2024 11:17' },
  { weightKg: 117.2, dateTime: '04.08.2024 11:16' },
  { weightKg: 128.5, dateTime: '30.06.2025 05:03' },
  { weightKg: 127.6, dateTime: '30.06.2025 11:58' },
  { weightKg: 126.6, dateTime: '07.07.2025 09:19' },
  { weightKg: 126.4, dateTime: '14.07.2025 12:04' },
  { weightKg: 127.2, dateTime: '21.07.2025 10:02' },
  { weightKg: 125.3, dateTime: '28.07.2025 12:34' },
  { weightKg: 125.5, dateTime: '04.08.2025 12:25' },
  { weightKg: 124.6, dateTime: '11.08.2025 12:14' },
  { weightKg: 124.8, dateTime: '18.08.2025 13:34' },
  { weightKg: 124.1, dateTime: '21.08.2025 10:12' },
  { weightKg: 123.5, dateTime: '25.08.2025 11:16' },
  { weightKg: 123.4, dateTime: '03.09.2025 12:09' },
  { weightKg: 122.8, dateTime: '06.09.2025 00:10' },
  { weightKg: 122.3, dateTime: '15.09.2025 10:35' },
  { weightKg: 122.7, dateTime: '22.09.2025 11:49' },
  { weightKg: 122.3, dateTime: '23.09.2025 10:21' },
  { weightKg: 121.9, dateTime: '30.09.2025 14:22' },
  { weightKg: 120.7, dateTime: '06.10.2025 11:30' },
  { weightKg: 120.9, dateTime: '13.10.2025 10:47' },
  { weightKg: 120.5, dateTime: '16.10.2025 21:30' },
  { weightKg: 119.6, dateTime: '18.10.2025 12:28' },
  { weightKg: 118.2, dateTime: '29.10.2025 12:03' },
  { weightKg: 116.8, dateTime: '18.11.2025 11:19' },
  { weightKg: 115.9, dateTime: '03.12.2025 12:51' },
];

export const weightEntries: WeightEntry[] = rawEntries.map((entry) => ({
  dateISO: parseDateTime(entry.dateTime),
  weightKg: entry.weightKg,
}));
