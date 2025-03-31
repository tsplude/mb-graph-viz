import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TreeVisualization from './components/TreeVisualization';
import DetailsPanel from './components/DetailsPanel';
import { parseFileContent } from './utils/fileParser';
import { parseTraceFile } from './utils/traceParser';
import { filterByMatch, filterByTrace } from './utils/graph';
import './App.css';

function App() {
  const [originalTreeData, setOriginalTreeData] = useState(null);
  const [filteredTreeData, setFilteredTreeData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displaySearchTerm, setDisplaySearchTerm] = useState('');
  const [traceData, setTraceData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

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

  // Update filtered tree when search term or trace data changes
  useEffect(() => {
    if (!originalTreeData) return;

    let filtered = { ...originalTreeData };

    // Apply trace filtering if trace data exists
    if (traceData) {
      filtered = filterByTrace(filtered, traceData);
      console.log('Filtered trace tree:', filtered);
    }

    // Apply search filtering if search term exists
    if (searchTerm) {
      filtered = filterByMatch(filtered, searchTerm);
    }

    setFilteredTreeData(filtered);
  }, [originalTreeData, searchTerm, traceData]);

  const handleDataLoaded = (data) => {
    setOriginalTreeData(data);
    setFilteredTreeData(data);
  };

  const handleTraceLoaded = (data) => {
    setTraceData(data);
  };

  const handleSearchChange = (event) => {
    setDisplaySearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(displaySearchTerm);
    }
  };

  const handleDetailsViewClick = (datum) => {
    setSelectedNode(prevNode => prevNode === datum ? null : datum);
  };

  return (
    <div className="App">
      <Header 
        displaySearchTerm={displaySearchTerm}
        onSearchChange={handleSearchChange}
        onSearchKeyDown={handleSearchKeyDown}
        onDataLoaded={handleDataLoaded}
        onTraceLoaded={handleTraceLoaded}
      />
      <main>
        {filteredTreeData && (
          <TreeVisualization 
            data={filteredTreeData} 
            isFiltered={searchTerm !== '' || traceData !== null}
            onDetailsViewClick={handleDetailsViewClick}
          />
        )}
        <DetailsPanel selectedNode={selectedNode} />
      </main>
    </div>
  );
}

export default App;
