import { Pressable, ScrollView, Text, View } from 'react-native'
import { Input } from '@/shared/components/Input'
import type { Sex } from '@/features/profile'
import type { Texts } from '@/i18n'
type BodyStepProps = {
  texts: Texts
  styles: Record<string, any>
  heightCm: string
  setHeightCm: (_value: string) => void
  weightKg: string
  setWeightKg: (_value: string) => void
  sex: Sex
  setSex: (_value: Sex) => void
  sexOptions: readonly Sex[]
}
export function BodyStep({
  texts,
  styles,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
  sex,
  setSex,
  sexOptions,
}: BodyStepProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.pageContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{texts.onboarding.bodyTitle}</Text>
        <Text style={styles.cardBody}>{texts.onboarding.bodyBody}</Text>
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.height}</Text>
          <Input
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="numeric"
            placeholder="175"
            inputStyle={styles.input}
            unit="cm"
            unitStyle={styles.unit}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.weight}</Text>
          <Input
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="numeric"
            placeholder="85.0"
            inputStyle={styles.input}
            unit="kg"
            unitStyle={styles.unit}
          />
          <Text style={styles.helper}>{texts.onboarding.bodyHelper}</Text>
        </View>
        <Text style={styles.scrollHint}>{texts.onboarding.activityHint}</Text>
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.sex}</Text>
          <View style={styles.segmentedRow}>
            {sexOptions.map((value) => (
              <Pressable
                key={value}
                style={[
                  styles.segment,
                  sex === value && styles.segmentActive,
                ]}
                onPress={() => setSex(value)}>
                <Text
                  style={[
                    styles.segmentText,
                    sex === value && styles.segmentTextActive,
                  ]}>
                  {value === 'male'
                    ? texts.profile.values.sexMale
                    : texts.profile.values.sexFemale}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
