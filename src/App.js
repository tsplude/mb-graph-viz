import React, { useState, useEffect } from 'react';
import FileImporter from './components/FileImporter';
import TreeVisualization from './components/TreeVisualization';
import { parseFileContent } from './utils/fileParser';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load default file on startup
  useEffect(() => {
    const loadDefaultFile = async () => {
      try {
        const response = await fetch('/mb-be-files.txt');
        const content = await response.text();
        const data = parseFileContent(content);
        setTreeData(data);
      } catch (error) {
        console.error('Error loading default file:', error);
      }
    };

    loadDefaultFile();
  }, []);

  const handleDataLoaded = (data) => {
    setTreeData(data);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>File Tree Visualization</h1>
        <FileImporter onDataLoaded={handleDataLoaded} onSearch={handleSearch} />
      </header>
      <main>
        {treeData && <TreeVisualization data={treeData} searchTerm={searchTerm} />}
      </main>
    </div>
  );
}

export default App;
