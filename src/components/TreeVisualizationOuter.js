import React from 'react';
import TreeVisualization from './TreeVisualization';

const TreeVisualizationOuter = ({ data }) => {
  return (
    <div className="tree-visualization-outer">
      <TreeVisualization data={data} />
    </div>
  );
};

export default TreeVisualizationOuter; 