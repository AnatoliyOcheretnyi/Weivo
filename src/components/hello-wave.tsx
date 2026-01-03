import Animated from 'react-native-reanimated';

import { helloWaveStyles } from './hello-wave.styles';
import { useTexts } from '@/i18n';

export function HelloWave() {
  const { texts } = useTexts();
  return (
    <Animated.Text style={helloWaveStyles.wave}>{texts.greeting.wave}</Animated.Text>
  );
}
