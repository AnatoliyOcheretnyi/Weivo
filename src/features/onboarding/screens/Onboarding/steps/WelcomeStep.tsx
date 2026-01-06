import { ScrollView, Text, View } from 'react-native'
import type { Texts } from '@/i18n'
type WelcomeStepProps = {
  texts: Texts
  styles: Record<string, any>
}
export function WelcomeStep({ texts, styles }: WelcomeStepProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.pageContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{texts.onboarding.welcomeTitle}</Text>
        <Text style={styles.cardBody}>{texts.onboarding.welcomeBody}</Text>
        <Text style={styles.cardBody}>{texts.onboarding.welcomeExtra}</Text>
      </View>
    </ScrollView>
  )
}
