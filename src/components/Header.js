import React from 'react';
import FileImporter from './FileImporter';
import { parseFileContent } from '../utils/fileParser';
import { parseTraceFile } from '../utils/traceParser';

const Header = ({ 
  displaySearchTerm, 
  onSearchChange, 
  onSearchKeyDown, 
  onDataLoaded,
  onTraceLoaded 
}) => {
  return (
    <header className="App-header">
      <div className="header-content">
        <h1>File Tree Visualization</h1>
        <div className="controls">
          <div className="search-container">
            <div className="file-label">Filter Nodes</div>
            <input
              type="text"
              placeholder="e.g. 'notification'"
              value={displaySearchTerm}
              onChange={onSearchChange}
              onKeyDown={onSearchKeyDown}
              className="search-input"
            />
          </div>
          <FileImporter 
            onDataLoaded={onDataLoaded} 
            label="Import 'find ./ > files.txt'"
            parser={parseFileContent}
          />
          <FileImporter 
            onDataLoaded={onTraceLoaded} 
            label="Import Trace"
            parser={parseTraceFile}
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 