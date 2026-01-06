import { Skia } from '@shopify/react-native-skia';
import { useCallback, useEffect, useRef } from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  GOAL_PROGRESS_PROGRESS_DURATION_MS,
  GOAL_PROGRESS_SUCCESS_DELAY_MS,
  GOAL_PROGRESS_SUCCESS_DURATION_MS,
} from './GoalProgressConstants';

type UseGoalProgressAnimationParams = {
  displayProgress: number;
  showSuccess: boolean;
  onSuccessComplete?: () => void;
  size: number;
  stroke: number;
};

export const useGoalProgressAnimation = ({
  displayProgress,
  showSuccess,
  onSuccessComplete,
  size,
  stroke,
}: UseGoalProgressAnimationParams) => {
  const progressValue = useSharedValue(0);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSuccessTimeout = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearSuccessTimeout();
    if (showSuccess) {
      progressValue.value = 0;
      progressValue.value = withTiming(1, {
        duration: GOAL_PROGRESS_SUCCESS_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      // TODO: Replace JS timer with Reanimated scheduleOnRN once available in this version.
      if (onSuccessComplete) {
        successTimeoutRef.current = setTimeout(() => {
          onSuccessComplete();
        }, GOAL_PROGRESS_SUCCESS_DURATION_MS + GOAL_PROGRESS_SUCCESS_DELAY_MS);
      }
      return;
    }
    progressValue.value = withTiming(displayProgress, {
      duration: GOAL_PROGRESS_PROGRESS_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [clearSuccessTimeout, displayProgress, onSuccessComplete, progressValue, showSuccess]);

  useEffect(() => clearSuccessTimeout, [clearSuccessTimeout]);

  const inset = stroke / 2;
  const arcPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: inset, y: inset, width: size - stroke, height: size - stroke },
      -90,
      progressValue.value * 360
    );
    return path;
  }, [inset, size, stroke, progressValue]);

  return { arcPath };
};
