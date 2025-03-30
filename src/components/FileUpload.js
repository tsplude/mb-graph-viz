import React, { useState } from 'react';
import FileImporter from './FileImporter';
import TreeVisualization from './TreeVisualization';

const FileUpload = () => {
  const [treeData, setTreeData] = useState(null);

  const handleDataLoaded = (data) => {
    setTreeData(data);
  };

  return (
    <div className="file-upload-container">
      <FileImporter onDataLoaded={handleDataLoaded} />
      {treeData && (
        <div className="visualization-container">
          <TreeVisualization data={treeData} />
        </div>
      )}
    </div>
  );
};

export default FileUpload; 