import React from 'react';
import './TraceInfoTable.css';

const TraceInfoTable = ({ funcData, fontSize }) => {
  if (!funcData?.calls) return null;

  const smallFontSize = fontSize - 2;

  return (
    <table className="trace-info-table">
      <tbody>
        {Object.entries(funcData.calls).map(([traceId, callData], index) => (
          <tr key={traceId} className="trace-info-row">
            <td className="trace-line" style={{ fontSize: `${smallFontSize}px` }}>{callData.line_num}</td>
            <td className="trace-id" style={{ fontSize: `${fontSize}px` }}>{traceId}</td>
            <td className="trace-name" style={{ fontSize: `${fontSize}px` }}>{funcData.name}</td>
            <td className="trace-calls" style={{ fontSize: `${smallFontSize}px` }}>{index + 1}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TraceInfoTable; 