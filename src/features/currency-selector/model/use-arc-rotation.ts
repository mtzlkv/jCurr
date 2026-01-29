import type { Currency } from '@/shared';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import {
  ANIMATION_DECELERATION,
  ANIMATION_SENSITIVITY,
  ANIMATION_VELOCITY_MULTIPLIER,
  ANIMATION_VELOCITY_THRESHOLD,
  BASE_ARC_ANGLE_SPAN,
  BASE_SECTOR_COUNT,
  SPRING_DAMPING,
  SPRING_SNAP_DAMPING,
  SPRING_SNAP_STIFFNESS,
  SPRING_STIFFNESS,
} from '../lib/constants';
import {
  getArcAngleSpan,
  getBaseAngleStep,
  getIndexFromAngle,
  getTargetAngleForIndex,
} from '../lib/utils';

interface UseArcRotationParams {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
}

export function useArcRotation({ currencies, selectedCurrency, onSelect }: UseArcRotationParams) {
  const baseAngleStep = getBaseAngleStep(BASE_SECTOR_COUNT, BASE_ARC_ANGLE_SPAN);
  const ARC_ANGLE_SPAN = getArcAngleSpan(currencies.length, baseAngleStep);
  const totalAngle = ARC_ANGLE_SPAN;
  // initial position without animation
  const getInitialAngle = () => {
    if (selectedCurrency && currencies.length > 0) {
      const index = currencies.findIndex((c) => c.code === selectedCurrency.code);
      if (index !== -1) {
        return getTargetAngleForIndex(index, totalAngle, currencies.length);
      }
    }
    if (currencies.length > 0) {
      return totalAngle / 2;
    }
    return 0;
  };

  const rotation = useSharedValue(getInitialAngle());
  const currentIndex = useSharedValue(
    selectedCurrency && currencies.length > 0
      ? currencies.findIndex((c) => c.code === selectedCurrency.code)
      : 0
  );
  const currenciesCount = useSharedValue(currencies.length);
  const totalAngleShared = useSharedValue(totalAngle);
  const isInitialized = React.useRef(false);

  useEffect(() => {
    currenciesCount.value = currencies.length;
    const newArcAngleSpan = getArcAngleSpan(currencies.length, baseAngleStep);
    totalAngleShared.value = newArcAngleSpan;
  }, [currencies.length, currenciesCount, baseAngleStep, totalAngleShared]);

  useEffect(() => {
    if (currencies.length === 0) {
      return;
    }

    if (selectedCurrency) {
      const index = currencies.findIndex((c) => c.code === selectedCurrency.code);
      if (index !== -1) {
        const targetAngle = getTargetAngleForIndex(index, totalAngle, currencies.length);
        if (!isInitialized.current) {
          // first init: set directly
          rotation.value = targetAngle;
          currentIndex.value = index;
          isInitialized.current = true;
        } else {
          rotation.value = withSpring(targetAngle, {
            damping: SPRING_DAMPING,
            stiffness: SPRING_STIFFNESS,
          });
          currentIndex.value = index;
        }
      }
    } else {
      // no selection: center first item
      const targetAngle = totalAngle / 2;
      if (!isInitialized.current) {
        rotation.value = targetAngle;
        currentIndex.value = 0;
        isInitialized.current = true;
      } else {
        rotation.value = withSpring(targetAngle, {
          damping: SPRING_DAMPING,
          stiffness: SPRING_STIFFNESS,
        });
        currentIndex.value = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency?.code, currencies.length, totalAngle]);

  // refs used in worklet callbacks
  const currenciesRef = React.useRef(currencies);
  const onSelectRef = React.useRef(onSelect);
  useEffect(() => {
    currenciesRef.current = currencies;
    onSelectRef.current = onSelect;
  }, [currencies, onSelect]);

  const updateSelectedCurrency = useCallback((index: number) => {
    const list = currenciesRef.current;
    const cb = onSelectRef.current;
    if (!list?.length || typeof cb !== 'function') return;
    const i = Math.max(0, Math.min(list.length - 1, Math.floor(index)));
    cb(list[i]);
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          'worklet';
          const angleDelta = event.translationY * ANIMATION_SENSITIVITY;
          const newAngle = rotation.value + angleDelta;
          const currentTotalAngle = totalAngleShared.value;
          const minAngle = -currentTotalAngle / 2 - currentTotalAngle * 0.1;
          const maxAngle = currentTotalAngle / 2 + currentTotalAngle * 0.1;
          const clampedAngle = Math.max(minAngle, Math.min(maxAngle, newAngle));
          rotation.value = clampedAngle;

          const count = currenciesCount.value;
          if (count <= 0 || currentTotalAngle <= 0) return;
          const angleForIndex = Math.max(-currentTotalAngle / 2, Math.min(currentTotalAngle / 2, clampedAngle));
          const newIndex = getIndexFromAngle(angleForIndex, currentTotalAngle, count);
          const safeIndex = Math.max(0, Math.min(count - 1, newIndex));
          
          if (safeIndex !== currentIndex.value) {
            currentIndex.value = safeIndex;
            runOnJS(updateSelectedCurrency)(safeIndex);
          }
        })
        .onEnd((event) => {
          'worklet';
          const count = currenciesCount.value;
          const currentTotalAngle = totalAngleShared.value;
          if (count <= 0 || currentTotalAngle <= 0) return;
          const clampedRotation = Math.max(-currentTotalAngle / 2, Math.min(currentTotalAngle / 2, rotation.value));
          const currentIndexValue = getIndexFromAngle(clampedRotation, currentTotalAngle, count);
          const safeIndexValue = Math.max(0, Math.min(count - 1, currentIndexValue));
          const finalAngle = getTargetAngleForIndex(safeIndexValue, currentTotalAngle, count);
          const velocity = event.velocityY * ANIMATION_VELOCITY_MULTIPLIER;
          
          if (Math.abs(velocity) > ANIMATION_VELOCITY_THRESHOLD) {
            const minAngle = -currentTotalAngle / 2 - currentTotalAngle * 0.1;
            const maxAngle = currentTotalAngle / 2 + currentTotalAngle * 0.1;
            rotation.value = withDecay(
              {
                velocity: velocity,
                clamp: [minAngle, maxAngle],
                deceleration: ANIMATION_DECELERATION,
              },
              (finished) => {
                'worklet';
                if (finished) {
                  const finalCount = currenciesCount.value;
                  const finalTotalAngle = totalAngleShared.value;
                  if (finalCount <= 0 || finalTotalAngle <= 0) return;
                  const clampedFinalRotation = Math.max(-finalTotalAngle / 2, Math.min(finalTotalAngle / 2, rotation.value));
                  const finalIndex = getIndexFromAngle(clampedFinalRotation, finalTotalAngle, finalCount);
                  const safeFinalIndex = Math.max(0, Math.min(finalCount - 1, finalIndex));
                  const snapAngle = getTargetAngleForIndex(safeFinalIndex, finalTotalAngle, finalCount);
                  rotation.value = withSpring(snapAngle, {
                    damping: SPRING_SNAP_DAMPING,
                    stiffness: SPRING_SNAP_STIFFNESS,
                  });
                  currentIndex.value = safeFinalIndex;
                  runOnJS(updateSelectedCurrency)(safeFinalIndex);
                }
              }
            );
          } else {
            rotation.value = withSpring(finalAngle, {
              damping: SPRING_SNAP_DAMPING,
              stiffness: SPRING_SNAP_STIFFNESS,
            });
            currentIndex.value = safeIndexValue;
            runOnJS(updateSelectedCurrency)(safeIndexValue);
          }
        }),
    [updateSelectedCurrency, rotation, currentIndex, currenciesCount, totalAngleShared]
  );

  return {
    rotation,
    currentIndex,
    panGesture,
    baseAngleStep,
    ARC_ANGLE_SPAN,
  };
}
