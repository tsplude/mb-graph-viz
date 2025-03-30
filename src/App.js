import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import TreeVisualizationOuter from './components/TreeVisualizationOuter';

function App() {
  const [traceData, setTraceData] = useState(null);

  const handleFileParsed = (data) => {
    setTraceData(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Call Stack Trace Visualizer</h1>
        <FileUpload onFileParsed={handleFileParsed} />
      </header>
      <main>
        {traceData && <TreeVisualizationOuter data={traceData} />}
      </main>
    </div>
  );
}

export default App;
