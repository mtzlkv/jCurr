import type { Currency } from '@/shared';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import {
    ARC_RADIUS,
    COLORS,
    ROTATION_AXIS_X,
    ROTATION_AXIS_Y,
    SECTOR_INNER_RADIUS,
    SECTOR_OUTER_RADIUS,
    SECTOR_SIZE,
} from '../lib/constants';
import { createSectorPaths } from '../lib/sector-utils';
import { styles } from './CurrencyArc.styles';

interface AnimatedCurrencyItemProps {
  currency: Currency;
  baseAngle: number;
  rotation: ReturnType<typeof useSharedValue<number>>;
  isSelected: boolean;
  isEven: boolean;
  onSelect: (currency: Currency) => void;
  angleStep: number;
}

export function AnimatedCurrencyItem({
  currency,
  baseAngle,
  rotation,
  isSelected,
  isEven,
  onSelect,
  angleStep,
}: AnimatedCurrencyItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const currentAngle = baseAngle + rotation.value;
    const innerRadius = SECTOR_INNER_RADIUS;
    const outerRadius = SECTOR_OUTER_RADIUS;
    
    return {
      left: ROTATION_AXIS_X + (ARC_RADIUS - outerRadius) * Math.cos(currentAngle) - SECTOR_SIZE / 2,
      top: ROTATION_AXIS_Y + (ARC_RADIUS - outerRadius) * Math.sin(currentAngle) - SECTOR_SIZE / 2,
      transform: [
        {
          rotate: `${((currentAngle + Math.PI) * 180) / Math.PI}deg`,
        },
        {
          scale: isSelected ? 1.2 : 1,
        },
      ],
      opacity: isSelected ? 1 : 0.6,
    };
  });

  const handlePress = () => {
    onSelect(currency);
  };

  const bgColor = isEven ? COLORS.BACKGROUND_EVEN : COLORS.BACKGROUND_ODD;
  // counter-rotate so label stays horizontal
  const textRotationStyle = useAnimatedStyle(() => {
    const currentAngle = baseAngle + rotation.value;
    const elementRotationDeg = ((currentAngle + Math.PI / 2) * 180) / Math.PI;
    return {
      transform: [{ rotate: `${-elementRotationDeg}deg` }],
    };
  });

  const { outerPath, innerPath } = createSectorPaths(angleStep);

  return (
    <Animated.View style={[styles.currencyItem, animatedStyle]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.pressableArea}>
        <View style={styles.sectorContainer}>
          <Svg
            width={SECTOR_SIZE}
            height={SECTOR_SIZE}
            style={styles.sectorSvg}
            viewBox={`${-SECTOR_OUTER_RADIUS} ${-SECTOR_OUTER_RADIUS} ${SECTOR_SIZE} ${SECTOR_SIZE}`}
          >
            <Path d={outerPath} fill={COLORS.BORDER} />
            <Path d={innerPath} fill={bgColor} />
          </Svg>
          <Animated.View style={[styles.textContainer, textRotationStyle]}>
            <View style={styles.textWrapper}>
              <Text style={[styles.currencyText, isSelected && styles.selectedText]}>
                {currency.code}
              </Text>
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
