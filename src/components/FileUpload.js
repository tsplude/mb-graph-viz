import React, { useState } from 'react';

const FileUpload = ({ onFileParsed }) => {
  const [error, setError] = useState(null);

  const parseTraceLine = (line) => {
    // Skip empty lines and return values
    if (!line.trim() || line.includes('=>')) return null;

    // Extract the function call part after the trace ID
    const match = line.match(/TRACE t\d+:\s*(\|*\s*\([^)]+\))/);
    if (!match) return null;

    const callPart = match[1];
    // Count the number of vertical bars to determine depth
    const depth = (callPart.match(/\|/g) || []).length;
    // Extract the function name from the parentheses
    const functionName = callPart.match(/\(([^)]+)\)/)[1];

    return { depth, functionName };
  };

  const buildTree = (lines) => {
    const root = { name: 'root', children: [] };
    const stack = [root];
    let currentDepth = 0;

    lines.forEach(line => {
      const parsed = parseTraceLine(line);
      if (!parsed) return;

      const { depth, functionName } = parsed;
      const node = { name: functionName, children: [] };

      // If we're going deeper, push the current node to the stack
      if (depth > currentDepth) {
        stack.push(stack[stack.length - 1].children[stack[stack.length - 1].children.length - 1]);
      }
      // If we're going shallower, pop nodes from the stack until we reach the right depth
      else if (depth < currentDepth) {
        while (stack.length > depth + 1) {
          stack.pop();
        }
      }

      // Add the new node as a child of the current parent
      stack[stack.length - 1].children.push(node);
      currentDepth = depth;
    });

    return root;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file name matches the expected pattern
    if (!file.name.startsWith('trace.')) {
      setError('File name must start with "trace."');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        const traceData = buildTree(lines);
        onFileParsed(traceData);
        setError(null);
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
      <input
        type="file"
        accept="trace.*"
        onChange={handleFileChange}
        className="file-input"
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default FileUpload; 