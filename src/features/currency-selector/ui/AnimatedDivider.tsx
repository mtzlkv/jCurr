import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ARC_RADIUS, ROTATION_AXIS_X, ROTATION_AXIS_Y } from '../lib/constants';
import { styles } from './CurrencyArc.styles';

interface AnimatedDividerProps {
  baseAngle: number;
  rotation: ReturnType<typeof useSharedValue<number>>;
}

export function AnimatedDivider({ baseAngle, rotation }: AnimatedDividerProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const currentAngle = baseAngle + rotation.value;
    return {
      left: ROTATION_AXIS_X + ARC_RADIUS * Math.cos(currentAngle),
      top: ROTATION_AXIS_Y + ARC_RADIUS * Math.sin(currentAngle),
      transform: [
        {
          rotate: `${((currentAngle + Math.PI / 2) * 180) / Math.PI}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.sectorDivider, animatedStyle]}>
      <View style={styles.dividerLine} />
    </Animated.View>
  );
}
