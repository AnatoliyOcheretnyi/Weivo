import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dimensions } from '@/theme';
import { parallaxScrollViewStyles } from '@/theme/styles/parallax-scroll-view';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-dimensions.parallax.headerHeight, 0, dimensions.parallax.headerHeight],
            [
              -dimensions.parallax.headerHeight / 2,
              0,
              dimensions.parallax.headerHeight * 0.75,
            ]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-dimensions.parallax.headerHeight, 0, dimensions.parallax.headerHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={[parallaxScrollViewStyles.container, { backgroundColor }]}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          parallaxScrollViewStyles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={parallaxScrollViewStyles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}
