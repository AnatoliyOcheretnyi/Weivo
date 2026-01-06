import { Skia } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

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
  const successTrigger = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(successTrigger);
    if (showSuccess) {
      progressValue.value = 0;
      progressValue.value = withTiming(1, {
        duration: GOAL_PROGRESS_SUCCESS_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      if (onSuccessComplete) {
        successTrigger.value = 0;
        successTrigger.value = withDelay(
          GOAL_PROGRESS_SUCCESS_DURATION_MS + GOAL_PROGRESS_SUCCESS_DELAY_MS,
          withTiming(1, { duration: 0 }, (finished) => {
            'worklet';
            if (finished) {
              scheduleOnRN(onSuccessComplete);
            }
          })
        );
      }
      return;
    }
    progressValue.value = withTiming(displayProgress, {
      duration: GOAL_PROGRESS_PROGRESS_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [displayProgress, onSuccessComplete, progressValue, showSuccess, successTrigger]);

  useEffect(() => () => cancelAnimation(successTrigger), [successTrigger]);

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
