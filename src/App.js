import React, { useState, useEffect } from 'react';
import FileImporter from './components/FileImporter';
import TreeVisualization from './components/TreeVisualization';
import { parseFileContent } from './utils/fileParser';
import { filterByMatch } from './utils/graph';
import './App.css';

function App() {
  const [originalTreeData, setOriginalTreeData] = useState(null);
  const [filteredTreeData, setFilteredTreeData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displaySearchTerm, setDisplaySearchTerm] = useState('');

  // Load default file on startup
  useEffect(() => {
    const loadDefaultFile = async () => {
      try {
        const response = await fetch('/mb-be-files.txt');
        const content = await response.text();
        const data = parseFileContent(content);
        setOriginalTreeData(data);
        setFilteredTreeData(data);
      } catch (error) {
        console.error('Error loading default file:', error);
      }
    };

    loadDefaultFile();
  }, []);

  const handleDataLoaded = (data) => {
    setOriginalTreeData(data);
    setFilteredTreeData(data);
  };

  const handleSearchChange = (event) => {
    setDisplaySearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(displaySearchTerm);
      if (originalTreeData) {
        const filtered = filterByMatch(originalTreeData, displaySearchTerm);
        setFilteredTreeData(filtered);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>File Tree Visualization</h1>
        <div className="controls">
          <FileImporter onDataLoaded={handleDataLoaded} />
          <input
            type="text"
            placeholder="Search nodes... (press Enter to search)"
            value={displaySearchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
          />
        </div>
      </header>
      <main>
        {filteredTreeData && (
          <TreeVisualization 
            data={filteredTreeData} 
            isFiltered={searchTerm !== ''} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
