import React from 'react';

const NodeInfo = ({ nodeDatum, onClose, x, y }) => {
  const width = 600;
  const height = 400;
  const padding = 15;
  const headerHeight = 30;
  const rowHeight = 25;

  // Convert functions object to array
  const functions = nodeDatum.traceData?.functions 
    ? Object.values(nodeDatum.traceData.functions)
    : [];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Background rectangle */}
      <rect
        width={width}
        height={height}
        fill="white"
        stroke="#0066cc"
        strokeWidth="1"
        rx="5"
        ry="5"
      />

      {/* Header with title and close button */}
      <g>
        <text
          x={padding}
          y={headerHeight - 5}
          fontSize="14"
          fontWeight="bold"
          fill="#333"
        >
          {nodeDatum.traceData?.file_prefix || nodeDatum.name}
        </text>
        <circle
          cx={width - padding}
          cy={headerHeight - 10}
          r="8"
          fill="#f0f0f0"
          stroke="#666"
          strokeWidth="1"
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        />
        <text
          x={width - padding}
          y={headerHeight - 5}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          ×
        </text>
      </g>

      {/* Total invocations */}
      <text
        x={padding}
        y={headerHeight + rowHeight}
        fontSize="12"
        fill="#666"
      >
        Total invocations: {nodeDatum.traceData?.total_n_calls || 0}
      </text>

      {/* Function details */}
      {functions.map((func, index) => (
        <g key={func.name} transform={`translate(0, ${headerHeight + (index + 2) * rowHeight})`}>
          <text
            x={padding}
            y={0}
            fontSize="12"
            fill="#333"
          >
            {func.name}
          </text>
          <text
            x={width - padding}
            y={0}
            fontSize="12"
            fill="#666"
            textAnchor="end"
          >
            {func.n_calls} calls
          </text>
        </g>
      ))}
    </g>
  );
};

export default NodeInfo; 