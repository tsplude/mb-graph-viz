import React, { useState } from 'react';
import { parseFileContent } from '../utils/fileParser';

const FileImporter = ({ onDataLoaded }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const treeData = parseFileContent(content);
        onDataLoaded(treeData);
      } catch (err) {
        setError('Error parsing file: ' + err.message);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  return (
    <div className="file-upload">
      <div className="input-group">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default FileImporter; 