import React, { useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';
import * as d3 from 'd3';
import CustomNode from './CustomNode';
import { NODE_WIDTH, NODE_HEIGHT, LEFT_CIRCLE_X, RIGHT_CIRCLE_X } from '../constants/nodeDimensions';

const TreeVisualization = ({ data, isFiltered, onDetailsViewClick }) => {
  const treeRef = useRef(null);

  // Expose the tree instance to window for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.treeInstance = treeRef.current;
    }
  }, []);

  const handleNodeHover = (node) => {
    console.log('Node hovered:', node);
  };

  // Function to determine link class based on node properties
  const getLinkClass = ({ source, target }) => {
    // You can add more complex logic here if needed
    return 'custom-tree-link';
  };

  const getExtents = () => {
    if (!data?.traceData) return null;
    return {
      function_calls: [data.traceData?.min_n_calls, data.traceData?.max_n_calls]
    };
  };

  return (
    <div className="tree-visualization">
      <Tree
        ref={treeRef}
        data={data}
        orientation="horizontal"
        renderCustomNodeElement={(rd3tProps) => (
          <CustomNode
            {...rd3tProps}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            leftCircleX={LEFT_CIRCLE_X}
            rightCircleX={RIGHT_CIRCLE_X}
            onNodeMouseOver={handleNodeHover}
            getExtents={getExtents}
            onDetailsViewClick={onDetailsViewClick}
          />
        )}
        onNodeMouseOver={handleNodeHover}
        separation={{ siblings: 2, nonSiblings: 5 }}
        translate={{ x: 50, y: 50 }}
        nodeSize={{ x: 1000, y: 100 }}
        zoomable={true}
        draggable={true}
        initialDepth={isFiltered ? undefined : 2}
        transitionDuration={10}
        collapsible={true}
        pathClassFunc={getLinkClass}
        pathFunc={(linkData, orientation) => {
          const { source, target } = linkData;
          const deltaX = target.y - source.y;
          const deltaY = target.x - source.x;
          
          // Create a curved path that connects to the circles on each node
          return `M${source.y + Math.abs(LEFT_CIRCLE_X - 10)},${source.x}
                  C${source.y + deltaX * 0.5},${source.x}
                   ${source.y + deltaX * 0.5},${target.x}
                   ${target.y - Math.abs(RIGHT_CIRCLE_X)},${target.x}`;
        }}
      />
    </div>
  );
};

export default TreeVisualization; 