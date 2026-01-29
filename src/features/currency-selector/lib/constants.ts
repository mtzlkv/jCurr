import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// arc layout
export const ROTATION_AXIS_X = -180;
export const ROTATION_AXIS_Y = SCREEN_HEIGHT * 0.4;
export const ARC_RADIUS = Math.min(SCREEN_WIDTH * 1.4, SCREEN_HEIGHT * 1.4);
export const BASE_ARC_ANGLE_SPAN = Math.PI / 2;
export const BASE_SECTOR_COUNT = 10;
// sector: narrow outer edge, wide toward center
export const SECTOR_INNER_RADIUS = 25;
export const SECTOR_OUTER_RADIUS = 60;
export const SECTOR_BORDER_WIDTH = 2;
export const SECTOR_SIZE = SECTOR_OUTER_RADIUS * 2;
// pan → rotation; decay inertia; spring snap to sector
export const ANIMATION_SENSITIVITY = 0.00009;
export const ANIMATION_VELOCITY_MULTIPLIER = 0.00002;
export const ANIMATION_VELOCITY_THRESHOLD = 0.0003;
export const ANIMATION_DECELERATION = 0.99;
export const SPRING_DAMPING = 30;
export const SPRING_STIFFNESS = 120;
export const SPRING_SNAP_DAMPING = 25;
export const SPRING_SNAP_STIFFNESS = 180;
export const COLORS = {
  BACKGROUND_EVEN: '#2A2A3A',
  BACKGROUND_ODD: '#3A3A4A',
  BORDER: '#000000',
  TEXT: '#FFFFFF',
  TEXT_SELECTED: '#4A90E2',
  DIVIDER: '#4A4A5A',
  ROTATION_AXIS: '#4A4A5A',
} as const;
