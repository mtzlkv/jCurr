import { Dimensions, StyleSheet } from 'react-native';
import {
    ARC_RADIUS,
    COLORS,
    ROTATION_AXIS_X,
    ROTATION_AXIS_Y,
    SECTOR_SIZE,
} from '../lib/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    left: 0,
    top: 0,
    overflow: 'visible',
  },
  rotationAxis: {
    position: 'absolute',
    left: ROTATION_AXIS_X - 1,
    top: 0,
    width: 2,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.ROTATION_AXIS,
    opacity: 0.3,
  },
  arcVisual: {
    position: 'absolute',
    width: ARC_RADIUS * 2,
    height: ARC_RADIUS * 2,
    left: ROTATION_AXIS_X - ARC_RADIUS,
    top: ROTATION_AXIS_Y - ARC_RADIUS,
    borderWidth: 2,
    borderColor: COLORS.DIVIDER,
    borderRadius: ARC_RADIUS,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  sectorDivider: {
    position: 'absolute',
    width: 0,
    height: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dividerLine: {
    width: 25,
    height: 2,
    backgroundColor: COLORS.DIVIDER,
    opacity: 0.6,
  },
  arcContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    left: 0,
    top: 0,
    overflow: 'visible',
  },
  currencyItem: {
    position: 'absolute',
    width: SECTOR_SIZE,
    height: SECTOR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectorContainer: {
    position: 'relative',
    width: SECTOR_SIZE,
    height: SECTOR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectorSvg: {
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  textWrapper: {
    transform: [{ rotate: '-90deg' }],
  },
  currencyText: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_SELECTED,
  },
  fadeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    pointerEvents: 'none',
  },
  fadeSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
