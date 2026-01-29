/** Maps rotation angle to currency index. */
export function getIndexFromAngle(
  angle: number,
  totalAngle: number,
  currenciesCount: number
): number {
  'worklet';
  if (currenciesCount <= 0) return 0;
  if (currenciesCount === 1) return 0;
  if (totalAngle <= 0) return 0;
  const minAngle = -totalAngle / 2;
  const maxAngle = totalAngle / 2;
  const clampedAngle = Math.max(minAngle, Math.min(maxAngle, angle));
  const index = Math.round((totalAngle / 2 - clampedAngle) / totalAngle * (currenciesCount - 1));
  return Math.max(0, Math.min(currenciesCount - 1, index));
}

/** Angle to center item at given index. */
export function getTargetAngleForIndex(
  index: number,
  totalAngle: number,
  currenciesCount: number
): number {
  'worklet';
  if (currenciesCount <= 0) return 0;
  if (currenciesCount === 1) return totalAngle / 2;
  if (totalAngle <= 0) return 0;
  const clampedIndex = Math.max(0, Math.min(currenciesCount - 1, index));
  return (totalAngle / 2) - (clampedIndex / (currenciesCount - 1)) * totalAngle;
}

export function getBaseAngleStep(baseSectorCount: number, baseArcAngleSpan: number): number {
  return baseArcAngleSpan / (baseSectorCount - 1);
}

export function getArcAngleSpan(currenciesCount: number, baseAngleStep: number): number {
  return baseAngleStep * (currenciesCount - 1);
}
