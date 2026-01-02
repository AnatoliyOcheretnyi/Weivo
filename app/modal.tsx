import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useWeightStore } from '@/features/weight';
import type { Mood } from '@/features/weight';

const moodOptions: { key: Mood; label: string }[] = [
  { key: 'happy', label: '🙂' },
  { key: 'neutral', label: '😐' },
  { key: 'sad', label: '😔' },
  { key: 'angry', label: '😠' },
];

export default function AddEntryModal() {
  const router = useRouter();
  const { addEntry } = useWeightStore();
  const [weightText, setWeightText] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();

  const weightValue = useMemo(() => {
    const normalized = weightText.replace(',', '.');
    const value = Number(normalized);
    return Number.isFinite(value) ? value : NaN;
  }, [weightText]);

  const canSave = Number.isFinite(weightValue) && weightValue > 20 && weightValue < 400;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    addEntry(Number(weightValue.toFixed(1)), mood);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>New weigh-in</Text>
        <Text style={styles.subtitle}>Add today&apos;s value and optional mood.</Text>

        <View style={styles.inputRow}>
          <TextInput
            value={weightText}
            onChangeText={setWeightText}
            placeholder="0.0"
            keyboardType="decimal-pad"
            style={styles.input}
            placeholderTextColor="#B9A999"
          />
          <Text style={styles.unit}>kg</Text>
        </View>

        <Text style={styles.sectionLabel}>Mood (optional)</Text>
        <View style={styles.moodRow}>
          {moodOptions.map((option) => {
            const active = option.key === mood;
            return (
              <Pressable
                key={option.key}
                onPress={() => setMood(active ? undefined : option.key)}
                style={[styles.moodButton, active && styles.moodButtonActive]}>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EFE4D7',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#F7F1E9',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1B1B1B',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    fontSize: 24,
    color: '#1B1B1B',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B5647',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 22,
    color: '#1B1B1B',
  },
  unit: {
    fontSize: 16,
    color: '#9A7E69',
  },
  sectionLabel: {
    marginTop: 18,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9A7E69',
  },
  moodRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  moodButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFE4D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    backgroundColor: '#1B1B1B',
  },
  moodLabel: {
    fontSize: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  cancelText: {
    color: '#6B5647',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1B1B1B',
  },
  saveButtonDisabled: {
    backgroundColor: '#B9A999',
  },
  saveText: {
    color: '#F7EFE6',
    fontSize: 14,
  },
});
