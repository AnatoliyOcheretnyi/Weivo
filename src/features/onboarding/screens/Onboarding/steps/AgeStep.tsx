import { ScrollView, Text, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import type { Texts } from '@/i18n'
type AgeStepProps = {
  texts: Texts
  styles: Record<string, any>
  birthDate: Date | null
  showDatePicker: boolean
  defaultBirthDate: Date
  onDateChange: (_event: unknown, _selectedDate?: Date) => void
}
export function AgeStep({
  texts,
  styles,
  birthDate,
  showDatePicker,
  defaultBirthDate,
  onDateChange,
}: AgeStepProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.pageContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{texts.onboarding.ageTitle}</Text>
        <Text style={styles.cardBody}>{texts.onboarding.ageBody}</Text>
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.birthDate}</Text>
          <View style={styles.inputRow}>
            <Text style={styles.input}>
              {birthDate
                ? birthDate.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : texts.onboarding.birthDatePlaceholder}
            </Text>
          </View>
          {showDatePicker && (
            <View style={styles.datePickerWrap}>
              <DateTimePicker
                value={birthDate ?? defaultBirthDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={onDateChange}
              />
            </View>
          )}
          <Text style={styles.helper}>{texts.onboarding.birthDateHelper}</Text>
        </View>
      </View>
    </ScrollView>
  )
}
