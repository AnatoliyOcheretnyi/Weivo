import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
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
import { createSegmentCreateStyles } from './SegmentCreateScreen.styles';

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

  const parseWeight = (value: string) => {
    const normalized = value.replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const startValue = useMemo(() => parseWeight(startWeight), [startWeight]);
  const targetValue = useMemo(() => parseWeight(target), [target]);

  const canSave =
    Number.isFinite(startValue) &&
    Number.isFinite(targetValue) &&
    startValue > 0 &&
    targetValue > 0;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    const segment: GoalSegment = {
      id: String(Date.now()),
      startKg: startValue,
      targetKg: targetValue,
      direction: inferredDirection,
      note: note.trim() || undefined,
      createdAtISO: new Date().toISOString(),
    };
    addSegment(segment);
    const nextStart =
      inferredDirection === 'gain' ? targetValue + 0.1 : targetValue - 0.1;
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
            <Input
              value={startWeight}
              onChangeText={setStartWeight}
              keyboardType="decimal-pad"
              placeholder="115.0"
              inputStyle={styles.input}
              unit="kg"
              unitStyle={styles.unit}
              containerStyle={styles.inputRow}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.targetWeight}</Text>
            <Input
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
              placeholder="110.0"
              inputStyle={styles.input}
              unit="kg"
              unitStyle={styles.unit}
              ref={targetInputRef}
              containerStyle={styles.inputRow}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.note}</Text>
            <Input
              value={note}
              onChangeText={setNote}
              placeholder={texts.segments.notePlaceholder}
              inputStyle={styles.input}
              containerStyle={styles.inputRow}
            />
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
