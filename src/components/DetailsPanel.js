import React, { useState } from 'react';
import Header from './panel/Header';
import TraceInfo from './panel/TraceInfo';
import './DetailsPanel.css';

const DetailsPanel = ({ selectedNode }) => {
  const [fontSize, setFontSize] = useState(14);

  const handleFontSizeChange = (delta) => {
    setFontSize(prevSize => Math.max(8, Math.min(24, prevSize + delta)));
  };

  if (!selectedNode) return null;

  return (
    <div className="details-panel">
      <div className="font-size-controls">
        <button onClick={() => handleFontSizeChange(-2)}>-</button>
        <button onClick={() => handleFontSizeChange(2)}>+</button>
      </div>
      <Header node={selectedNode} fontSize={fontSize} />
      <TraceInfo node={selectedNode} fontSize={fontSize} />
    </div>
  );
};

export default DetailsPanel; 