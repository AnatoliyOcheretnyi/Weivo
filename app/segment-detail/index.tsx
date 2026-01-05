import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAppTheme } from '@/theme';
import { useTexts } from '@/i18n';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGoalSegments, type GoalSegment } from '@/features/weight';
import { createSegmentDetailStyles } from './segment-detail.styles';

export default function SegmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { texts } = useTexts();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createSegmentDetailStyles(colors), [colors]);
  const { segments, updateSegment, removeSegment } = useGoalSegments();

  const segment = segments.find((item) => item.id === id);
  const ordered = useMemo(
    () => [...segments].sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [segments]
  );
  const isLatest = segment ? ordered[0]?.id === segment.id : false;
  const [isEditing, setIsEditing] = useState(false);
  const [startWeight, setStartWeight] = useState(
    segment ? segment.startKg.toFixed(1) : ''
  );
  const [targetWeight, setTargetWeight] = useState(
    segment ? segment.targetKg.toFixed(1) : ''
  );
  const [note, setNote] = useState(segment?.note ?? '');

  if (!segment) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.card}>
          <Text style={styles.title}>{texts.segments.detailTitle}</Text>
          <Text style={styles.subtitle}>{texts.segments.detailMissing}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditToggle = () => {
    if (!isLatest) {
      Alert.alert(texts.segments.editBlockedTitle, texts.segments.editBlockedMessage);
      return;
    }
    setIsEditing((value) => !value);
  };

  const handleSave = () => {
    const updated: GoalSegment = {
      ...segment,
      startKg: Number(startWeight),
      targetKg: Number(targetWeight),
      note: note.trim() || undefined,
    };
    updateSegment(updated);
    setIsEditing(false);
    router.back();
  };

  const handleDelete = () => {
    if (!isLatest) {
      Alert.alert(texts.segments.editBlockedTitle, texts.segments.editBlockedMessage);
      return;
    }
    Alert.alert(
      texts.segments.deleteTitle,
      texts.segments.deleteMessage,
      [
        { text: texts.segments.deleteCancel, style: 'cancel' },
        {
          text: texts.segments.deleteConfirm,
          style: 'destructive',
          onPress: () => {
            removeSegment(segment.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{texts.segments.detailTitle}</Text>
              <Text style={styles.subtitle}>{texts.segments.detailSubtitle}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconButton} onPress={handleEditToggle}>
                <IconSymbol name="pencil" size={16} color={colors.inkMuted} />
              </Pressable>
              <Pressable style={[styles.iconButton, styles.iconButtonDanger]} onPress={handleDelete}>
                <IconSymbol name="trash" size={16} color={colors.accentOrangeDark} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.startWeight}</Text>
            <View style={[styles.inputRow, !isEditing && styles.readOnly]}>
              <TextInput
                value={startWeight}
                onChangeText={setStartWeight}
                keyboardType="numeric"
                placeholder="115.0"
                placeholderTextColor={colors.inkAccent}
                style={styles.input}
                editable={isEditing}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.targetWeight}</Text>
            <View style={[styles.inputRow, !isEditing && styles.readOnly]}>
              <TextInput
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="numeric"
                placeholder="110.0"
                placeholderTextColor={colors.inkAccent}
                style={styles.input}
                editable={isEditing}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.note}</Text>
            <View style={[styles.inputRow, !isEditing && styles.readOnly]}>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={texts.segments.notePlaceholder}
                placeholderTextColor={colors.inkAccent}
                style={styles.input}
                editable={isEditing}
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.actionRow}>
              <Pressable style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelText}>{texts.segments.cancel}</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>{texts.segments.save}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
