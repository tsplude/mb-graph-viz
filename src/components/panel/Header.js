import React from 'react';
import './Header.css';

const Header = ({ node, fontSize }) => {
  if (!node) return null;

  const h1Size = fontSize + 4;
  const h2Size = fontSize + 2;
  const rowSize = fontSize - 2;

  const filepath = node.children?.length === 0 ?
    node.traceData.file_prefix.replaceAll("-", "_") + ".clj" :
    node.traceData.file_prefix;
  const namespace = node.traceData?.file_prefix?.replaceAll("/", ".");

  return (
    <div className="panel-header">
      <h1 style={{ fontSize: `${h1Size}px` }}>{node.name}</h1>
      {node.traceData?.file_prefix && (
        <h2 style={{ fontSize: `${h2Size}px` }}>File prefix: {node.traceData.file_prefix}</h2>
      )}
      {node.traceData?.file_prefix && (
        <div className="link-container">
          <h2 style={{ fontSize: `${h2Size}px` }}>
            <a href={`https://github.com/metabase/metabase/tree/master/src/${filepath}`} target="_blank" rel="noopener noreferrer">{namespace}</a>
          </h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="link-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        </div>
      )}
      {node.traceData?.total_n_calls && (
        <h2 style={{ fontSize: `${h2Size}px` }}>n = {node.traceData.total_n_calls}</h2>
      )}
    </div>
  );
};

export default Header; 