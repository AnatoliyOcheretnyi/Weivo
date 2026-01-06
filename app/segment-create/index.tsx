import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { useAppTheme } from '@/theme';
import { useTexts } from '@/i18n';
import { useProfileStore } from '@/features/profile';
import {
  GoalSegmentTrack,
  useGoalSegments,
  useWeightStore,
  type GoalSegment,
  type GoalSegmentDirection,
} from '@/features/weight';
import { createSegmentCreateStyles } from './segment-create.styles';

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
  const [startWeight, setStartWeight] = useState(initialStartWeight);
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const targetInputRef = useRef<TextInput>(null);

  const start = Number(startWeight);
  const computedTarget = Number(target);

  const canSave =
    start > 0 &&
    Number(target) > 0 &&
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
    const nextStart =
      inferredDirection === 'gain' ? computedTarget + 0.1 : computedTarget - 0.1;
    setStartWeight(nextStart.toFixed(1));
    setTarget('');
    setNote('');
    targetInputRef.current?.focus();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <Text style={styles.title}>{texts.segments.createTitle}</Text>
          <Text style={styles.subtitle}>{texts.segments.createSubtitle}</Text>

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
                ref={targetInputRef}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

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
            <Button
              title={texts.segments.cancel}
              variant="inverse"
              onPress={() => router.back()}
              style={styles.actionButton}
            />
            <Button
              title={texts.segments.save}
              onPress={handleSave}
              disabled={!canSave}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>{texts.profile.sections.segments}</Text>
          </View>
          <View style={styles.previewCard}>
            <GoalSegmentTrack
              segments={segments}
              currentKg={latestWeight || undefined}
              showAddNode
              allowSegmentPress={false}
              onAddPress={() => {
                targetInputRef.current?.focus();
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
            />
          </View>
        </View>

        <View style={styles.doneRow}>
          <Button
            title={texts.segments.done}
            onPress={() => router.back()}
            style={styles.doneButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
