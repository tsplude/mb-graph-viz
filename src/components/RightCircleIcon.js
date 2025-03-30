import React from 'react';
import {
  RIGHT_CIRCLE_RADIUS,
  RIGHT_CIRCLE_STROKE_WIDTH,
  RIGHT_CIRCLE_FILL,
  RIGHT_CIRCLE_STROKE
} from '../constants/nodeDimensions';

const RIGHT_CIRCLE_ICON_SIZE = 24;

const RightCircleIcon = ({ x, y }) => {
  return (
    <g transform={`translate(${x - RIGHT_CIRCLE_ICON_SIZE} ${y - RIGHT_CIRCLE_ICON_SIZE})`}>
      <svg
        x={RIGHT_CIRCLE_ICON_SIZE - 6}
        y={RIGHT_CIRCLE_ICON_SIZE / 2}
        width={RIGHT_CIRCLE_ICON_SIZE}
        height={RIGHT_CIRCLE_ICON_SIZE}
        viewBox="0 0 24 24"
        fill={RIGHT_CIRCLE_FILL}
        stroke={RIGHT_CIRCLE_STROKE}
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </g>
  );
};

export default RightCircleIcon; 