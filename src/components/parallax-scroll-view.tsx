import type { PropsWithChildren, ReactElement } from 'react';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dimensions, useAppTheme } from '@/theme';
import { parallaxScrollViewStyles } from './parallax-scroll-view.styles';

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
  const { scheme } = useAppTheme();
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
          { backgroundColor: headerBackgroundColor[scheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={parallaxScrollViewStyles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}
