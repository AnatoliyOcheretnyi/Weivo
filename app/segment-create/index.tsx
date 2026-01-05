import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useAppTheme } from '@/theme';
import { useTexts } from '@/i18n';
import { useProfileStore } from '@/features/profile';
import { useGoalSegments, useWeightStore, type GoalSegment, type GoalSegmentDirection } from '@/features/weight';
import { createSegmentCreateStyles } from './segment-create.styles';

type SegmentMode = 'delta' | 'target';

export default function SegmentCreateScreen() {
  const router = useRouter();
  const { texts } = useTexts();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createSegmentCreateStyles(colors), [colors]);
  const { entries } = useWeightStore();
  const { profile } = useProfileStore();
  const { segments, addSegment } = useGoalSegments();

  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : 0;
  const lastSegment = segments[0];
  const inferredDirection: GoalSegmentDirection =
    lastSegment?.direction ?? (profile.goalType === 'gain' ? 'gain' : 'lose');
  const initialStartWeight = useMemo(() => {
    if (lastSegment?.targetKg != null) {
      return (lastSegment.targetKg - 0.1).toFixed(1);
    }
    return latestWeight ? latestWeight.toFixed(1) : '';
  }, [lastSegment?.targetKg, latestWeight]);
  const [mode, setMode] = useState<SegmentMode>('target');
  const [startWeight, setStartWeight] = useState(initialStartWeight);
  const [delta, setDelta] = useState('');
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');

  const start = Number(startWeight);
  const computedTarget =
    mode === 'delta'
      ? start + (inferredDirection === 'lose' ? -Number(delta) : Number(delta))
      : Number(target);

  const canSave =
    start > 0 &&
    (mode === 'delta' ? Number(delta) > 0 : Number(target) > 0) &&
    !Number.isNaN(computedTarget);

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    const segment: GoalSegment = {
      id: String(Date.now()),
      startKg: start,
      targetKg: computedTarget,
      direction: inferredDirection,
      note: note.trim() || undefined,
      createdAtISO: new Date().toISOString(),
    };
    addSegment(segment);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <Text style={styles.title}>{texts.segments.createTitle}</Text>
          <Text style={styles.subtitle}>{texts.segments.createSubtitle}</Text>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.mode}</Text>
            <View style={styles.segmentedRow}>
              {(['delta', 'target'] as SegmentMode[]).map((value) => (
                <Pressable
                  key={value}
                  style={[styles.segment, mode === value && styles.segmentActive]}
                  onPress={() => setMode(value)}>
                  <Text
                    style={[styles.segmentText, mode === value && styles.segmentTextActive]}>
                    {value === 'delta'
                      ? texts.segments.modeDelta
                      : texts.segments.modeTarget}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.helper}>{texts.segments.modeHelper}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.startWeight}</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={startWeight}
                onChangeText={setStartWeight}
                keyboardType="numeric"
                placeholder="115.0"
                placeholderTextColor={colors.inkAccent}
                style={styles.input}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          {mode === 'delta' ? (
            <View style={styles.section}>
              <Text style={styles.label}>{texts.segments.delta}</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={delta}
                  onChangeText={setDelta}
                  keyboardType="numeric"
                  placeholder="5.0"
                  placeholderTextColor={colors.inkAccent}
                  style={styles.input}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.label}>{texts.segments.targetWeight}</Text>
              <View style={styles.inputRow}>
                <TextInput
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="numeric"
                  placeholder="110.0"
                  placeholderTextColor={colors.inkAccent}
                  style={styles.input}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.note}</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={texts.segments.notePlaceholder}
                placeholderTextColor={colors.inkAccent}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>{texts.segments.cancel}</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={handleSave} disabled={!canSave}>
              <Text style={styles.saveText}>{texts.segments.save}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
