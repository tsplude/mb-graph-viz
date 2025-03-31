import React from 'react';
import TraceInfoTable from './TraceInfoTable';
import './TraceInfo.css';

const TraceInfo = ({ node, fontSize }) => {
  if (!node?.traceData?.functions) return null;
  console.log("Node: ", node);
  return (
    <div className="trace-info">
      {Object.entries(node.traceData.functions).map(([key, funcData]) => (
        <div key={key} className="trace-info-section">
          <div className="trace-info-header" style={{ fontSize: `${fontSize}px` }}>
            {node.name.split(".")[0] + "/" + key}
          </div>
          <TraceInfoTable funcData={funcData} fontSize={fontSize} />
        </div>
      ))}
    </div>
  );
};

export default TraceInfo; 