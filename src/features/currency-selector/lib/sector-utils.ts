import {
    SECTOR_BORDER_WIDTH,
    SECTOR_INNER_RADIUS,
    SECTOR_OUTER_RADIUS,
} from './constants';

/** SVG path for radial sector (narrow at outer edge, wide toward center). */
export function createSectorPaths(angleStep: number) {
  const innerRadius = SECTOR_INNER_RADIUS;
  const outerRadius = SECTOR_OUTER_RADIUS;
  const borderWidth = SECTOR_BORDER_WIDTH;
  const centerX = 0;
  const centerY = 0;
  const startAngle = -angleStep / 2;
  const endAngle = angleStep / 2;
  const outerStartX = centerX + outerRadius * Math.cos(startAngle);
  const outerStartY = centerY + outerRadius * Math.sin(startAngle);
  const outerEndX = centerX + outerRadius * Math.cos(endAngle);
  const outerEndY = centerY + outerRadius * Math.sin(endAngle);
  const innerStartX = centerX + innerRadius * Math.cos(startAngle);
  const innerStartY = centerY + innerRadius * Math.sin(startAngle);
  const innerEndX = centerX + innerRadius * Math.cos(endAngle);
  const innerEndY = centerY + innerRadius * Math.sin(endAngle);
  const largeArcFlag = angleStep > Math.PI ? 1 : 0;
  const sweepFlag = 1;
  const outerPath = `M ${outerStartX},${outerStartY} 
                     L ${innerStartX},${innerStartY} 
                     A ${innerRadius},${innerRadius} 0 ${largeArcFlag},${sweepFlag} ${innerEndX},${innerEndY}
                     L ${outerEndX},${outerEndY}
                     A ${outerRadius},${outerRadius} 0 ${largeArcFlag},0 ${outerStartX},${outerStartY} Z`;
  const innerInnerRadius = innerRadius + borderWidth;
  const innerOuterRadius = outerRadius - borderWidth;
  
  const innerOuterStartX = centerX + innerOuterRadius * Math.cos(startAngle);
  const innerOuterStartY = centerY + innerOuterRadius * Math.sin(startAngle);
  const innerOuterEndX = centerX + innerOuterRadius * Math.cos(endAngle);
  const innerOuterEndY = centerY + innerOuterRadius * Math.sin(endAngle);
  
  const innerInnerStartX = centerX + innerInnerRadius * Math.cos(startAngle);
  const innerInnerStartY = centerY + innerInnerRadius * Math.sin(startAngle);
  const innerInnerEndX = centerX + innerInnerRadius * Math.cos(endAngle);
  const innerInnerEndY = centerY + innerInnerRadius * Math.sin(endAngle);
  
  const innerPath = `M ${innerOuterStartX},${innerOuterStartY} 
                     L ${innerInnerStartX},${innerInnerStartY} 
                     A ${innerInnerRadius},${innerInnerRadius} 0 ${largeArcFlag},${sweepFlag} ${innerInnerEndX},${innerInnerEndY}
                     L ${innerOuterEndX},${innerOuterEndY}
                     A ${innerOuterRadius},${innerOuterRadius} 0 ${largeArcFlag},0 ${innerOuterStartX},${innerOuterStartY} Z`;
  
  return { outerPath, innerPath };
}
