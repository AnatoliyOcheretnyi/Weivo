import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useWeightStore } from '@/features/weight';
import type { Mood } from '@/features/weight';
import { modalStyles } from './modal.styles';
import { colors } from '@/theme';
import { useTexts } from '@/i18n';

export default function AddEntryModal() {
  const router = useRouter();
  const { addEntry } = useWeightStore();
  const { texts } = useTexts();
  const [weightText, setWeightText] = useState('');
  const [mood, setMood] = useState<Mood | undefined>();
  const moodOptions: { key: Mood; label: string }[] = [
    { key: 'happy', label: texts.moods.happy },
    { key: 'neutral', label: texts.moods.neutral },
    { key: 'sad', label: texts.moods.sad },
    { key: 'angry', label: texts.moods.angry },
  ];

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
    <SafeAreaView style={modalStyles.screen}>
      <View style={modalStyles.card}>
        <Text style={modalStyles.title}>{texts.modal.title}</Text>
        <Text style={modalStyles.subtitle}>{texts.modal.subtitle}</Text>

        <View style={modalStyles.inputRow}>
          <TextInput
            value={weightText}
            onChangeText={setWeightText}
            placeholder={texts.modal.placeholderWeight}
            keyboardType="decimal-pad"
            style={modalStyles.input}
            placeholderTextColor={colors.inkAccent}
          />
          <Text style={modalStyles.unit}>{texts.home.units.kg}</Text>
        </View>

        <Text style={modalStyles.sectionLabel}>{texts.modal.moodLabel}</Text>
        <View style={modalStyles.moodRow}>
          {moodOptions.map((option) => {
            const active = option.key === mood;
            return (
              <Pressable
                key={option.key}
                onPress={() => setMood(active ? undefined : option.key)}
                style={[modalStyles.moodButton, active && modalStyles.moodButtonActive]}>
                <Text style={modalStyles.moodLabel}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={modalStyles.actionRow}>
          <Pressable style={modalStyles.cancelButton} onPress={() => router.back()}>
            <Text style={modalStyles.cancelText}>{texts.modal.cancel}</Text>
          </Pressable>
          <Pressable
            style={[modalStyles.saveButton, !canSave && modalStyles.saveButtonDisabled]}
            onPress={handleSave}>
            <Text style={modalStyles.saveText}>{texts.modal.save}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
