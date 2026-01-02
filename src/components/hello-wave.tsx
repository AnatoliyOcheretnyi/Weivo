import Animated from 'react-native-reanimated';

import { helloWaveStyles } from '@/theme/styles/hello-wave';
import { texts } from '@/texts';

export function HelloWave() {
  return (
    <Animated.Text style={helloWaveStyles.wave}>{texts.greeting.wave}</Animated.Text>
  );
}
