import React, { useState, useEffect } from 'react';
import NodeContent from './NodeContent';

const TreeNode = ({ node, onClick, isExpanded }) => {
  const hasChildren = node.children || node._children;
  const isLeaf = !hasChildren;
  const [contentWidth, setContentWidth] = useState(120); // Default minimum width
  const [totalWidth, setTotalWidth] = useState(200); // Default width including padding

  useEffect(() => {
    // Calculate total width including padding and expand icon
    const padding = 32; // 16px padding on each side
    const expandIconWidth = hasChildren ? 28 : 0; // 20px icon + 8px gap
    setTotalWidth(Math.max(200, contentWidth + padding + expandIconWidth));
  }, [contentWidth, hasChildren]);

  return (
    <g transform={`translate(${node.y},${node.x})`}>
      <g
        className={`node ${isLeaf ? 'leaf' : ''} ${isExpanded ? 'expanded' : 'collapsed'}`}
        onClick={() => onClick(node)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <foreignObject
          x={-totalWidth/2}
          y="-25"
          width={totalWidth}
          height="50"
          style={{ overflow: 'visible' }}
        >
          <div className="node-container">
            <NodeContent 
              name={node.data.name} 
              onWidthChange={setContentWidth}
            />
            {hasChildren && (
              <div className="expand-icon">
                {isExpanded ? '−' : '+'}
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    </g>
  );
};

export default TreeNode; 