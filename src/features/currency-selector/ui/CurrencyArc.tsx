import type { Currency } from '@/shared';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useArcRotation } from '../model/use-arc-rotation';
import { AnimatedCurrencyItem } from './AnimatedCurrencyItem';
import { AnimatedDivider } from './AnimatedDivider';
import { styles } from './CurrencyArc.styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_FADE_HEIGHT = 450;

interface CurrencyArcProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  visible: boolean;
}

export function CurrencyArc({ currencies, selectedCurrency, onSelect, visible }: CurrencyArcProps) {
  const {
    rotation,
    panGesture,
    baseAngleStep,
    ARC_ANGLE_SPAN,
  } = useArcRotation({ currencies, selectedCurrency, onSelect });

  if (!visible || currencies.length === 0) return null;
  const actualArcStartAngle = -ARC_ANGLE_SPAN / 2;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={styles.rotationAxis} />
        <View style={styles.arcVisual} />
        <View style={styles.arcContainer}>
          {currencies.map((_, index) => {
            if (index === 0) return null;

            const baseDividerAngle = actualArcStartAngle + baseAngleStep * index;

            return (
              <AnimatedDivider
                key={`divider-${index}`}
                baseAngle={baseDividerAngle}
                rotation={rotation}
              />
            );
          })}
          {currencies.map((currency, index) => {
            const baseAngle = actualArcStartAngle + baseAngleStep * index;
            const isSelected = selectedCurrency?.code === currency.code;
            const isEven = index % 2 === 0;

            return (
              <AnimatedCurrencyItem
                key={currency.code}
                currency={currency}
                baseAngle={baseAngle}
                rotation={rotation}
                isSelected={isSelected}
                isEven={isEven}
                onSelect={onSelect}
                angleStep={baseAngleStep}
              />
            );
          })}
        </View>
        <View style={styles.fadeContainer} pointerEvents="none">
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={styles.fadeSvg}>
            <Defs>
              <LinearGradient id="fadeTop" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="1" />
                <Stop offset="0.3" stopColor="#000000" stopOpacity="0.8" />
                <Stop offset="0.6" stopColor="#000000" stopOpacity="0.4" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0" />
              </LinearGradient>
              <LinearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                <Stop offset="0.2" stopColor="#000000" stopOpacity="0.3" />
                <Stop offset="0.45" stopColor="#000000" stopOpacity="0.7" />
                <Stop offset="0.55" stopColor="#000000" stopOpacity="1" />
                <Stop offset="1" stopColor="#000000" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT * 0.4}
              fill="url(#fadeTop)"
            />
            <Rect
              x="0"
              y={SCREEN_HEIGHT - BOTTOM_FADE_HEIGHT}
              width={SCREEN_WIDTH}
              height={BOTTOM_FADE_HEIGHT}
              fill="url(#fadeBottom)"
            />
          </Svg>
        </View>
      </View>
    </GestureDetector>
  );
}

