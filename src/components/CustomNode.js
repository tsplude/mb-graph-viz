import React, { useState } from 'react';
import {
  NODE_WIDTH,
  NODE_HEIGHT,
  LEFT_CIRCLE_RADIUS,
  RIGHT_CIRCLE_RADIUS,
  LEFT_CIRCLE_STROKE_WIDTH,
  RIGHT_CIRCLE_STROKE_WIDTH,
  LEFT_CIRCLE_FILL,
  RIGHT_CIRCLE_FILL,
  LEFT_CIRCLE_STROKE,
  RIGHT_CIRCLE_STROKE,
  LEFT_CIRCLE_X,
  RIGHT_CIRCLE_X,
  NODE_X_OFFSET,
  NODE_Y_OFFSET,
  NODE_PADDING_X,
  NODE_PADDING_Y,
  NODE_PADDING_LEFT,
  NODE_PADDING_RIGHT,
  NODE_PADDING_TOP,
  NODE_PADDING_BOTTOM,
  NODE_BACKGROUND,
  NODE_BORDER_COLOR,
  NODE_BORDER_WIDTH,
  NODE_BORDER_RADIUS,
  NODE_BOX_SHADOW,
  NODE_TEXT_COLOR,
  NODE_TEXT_FONT_FAMILY,
  NODE_TEXT_FONT_SIZE,
  NODE_COLOR_MIN,
  NODE_COLOR_MAX,
} from '../constants/nodeDimensions';
import NodeIcon from './NodeIcon';
import RightCircleIcon from './RightCircleIcon';
import InfoIcon from './InfoIcon';
import NodeInfo from './NodeInfo';
import { interpolateColor } from '../utils/color';

const CustomNode = ({ 
  nodeDatum, 
  toggleNode,
  width = NODE_WIDTH,
  height = NODE_HEIGHT,
  leftCircleRadius = LEFT_CIRCLE_RADIUS,
  rightCircleRadius = RIGHT_CIRCLE_RADIUS,
  leftCircleStrokeWidth = LEFT_CIRCLE_STROKE_WIDTH,
  rightCircleStrokeWidth = RIGHT_CIRCLE_STROKE_WIDTH,
  leftCircleFill = LEFT_CIRCLE_FILL,
  rightCircleFill = RIGHT_CIRCLE_FILL,
  leftCircleStroke = LEFT_CIRCLE_STROKE,
  rightCircleStroke = RIGHT_CIRCLE_STROKE,
  leftCircleX = LEFT_CIRCLE_X,
  rightCircleX = RIGHT_CIRCLE_X,
  nodeXOffset = NODE_X_OFFSET,
  nodeYOffset = NODE_Y_OFFSET,
  getExtents,
}) => {
  const hasChildren = nodeDatum.children?.length > 0;
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    setShowInfo(true);
  };

  const handleCloseInfo = (e) => {
    e.stopPropagation();
    setShowInfo(false);
  };

  // Calculate color factor based on total_n_calls
  const getColorFactor = () => {
    if (!nodeDatum.traceData?.total_n_calls || !getExtents) return 0;
    
    const [min, max] = getExtents().function_calls;
    if (min === max) return 0;
    
    return (nodeDatum.traceData.total_n_calls - min) / (max - min);
  };

  const colorFactor = getColorFactor();
  const nodeColor = colorFactor > 0 ? interpolateColor(NODE_COLOR_MIN, NODE_COLOR_MAX, colorFactor) : NODE_BACKGROUND;

  return (
    <g>
      {/* Left circle for incoming paths */}
      <circle
        r={leftCircleRadius}
        cx={leftCircleX}
        cy={0}
        fill={leftCircleFill}
        stroke={leftCircleStroke}
        strokeWidth={leftCircleStrokeWidth}
        fillOpacity={0.5}
      />
      
      {/* Main node container */}
      <foreignObject
        x={nodeXOffset}
        y={nodeYOffset}
        width={width}
        height={height}
        style={{ overflow: 'visible' }}
      >
        <div
          className="node-container"
          onClick={toggleNode}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: nodeColor,
            border: `${NODE_BORDER_WIDTH} solid ${NODE_BORDER_COLOR}`,
            borderRadius: NODE_BORDER_RADIUS,
            padding: `${NODE_PADDING_TOP}px ${NODE_PADDING_RIGHT}px ${NODE_PADDING_BOTTOM}px ${NODE_PADDING_LEFT}px`,
            height: `${height - NODE_PADDING_Y}px`, // Account for padding
            boxShadow: NODE_BOX_SHADOW,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            minWidth: `${width - NODE_PADDING_X}px`, // Account for padding
            position: 'relative' // For absolute positioning of icon
          }}
        >
          <NodeIcon isFolder={hasChildren} />
          <div
            className="node-content"
            style={{
              fontFamily: NODE_TEXT_FONT_FAMILY,
              fontSize: NODE_TEXT_FONT_SIZE,
              color: NODE_TEXT_COLOR,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginLeft: '32px', // Make space for the icon
              flex: 1 // Allow content to take remaining space
            }}
          >
            {nodeDatum.name}
          </div>
          {isHovered && (
            <div style={{ position: 'absolute', right: '8px' }}>
              <InfoIcon onClick={handleIconClick} />
            </div>
          )}
        </div>
      </foreignObject>

      {/* Right circle arrow icon - only show if node has children */}
      {hasChildren && <RightCircleIcon x={rightCircleX} y={0} />}

      {showInfo && (
        <NodeInfo
          nodeDatum={nodeDatum}
          onClose={handleCloseInfo}
          x={30}
          y={-100}
        />
      )}
    </g>
  );
};

export default CustomNode; 