import React, { useRef, useEffect, useState } from 'react';

const NodeContent = ({ name, onWidthChange }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && onWidthChange) {
      const width = contentRef.current.offsetWidth;
      onWidthChange(width);
    }
  }, [name, onWidthChange]);

  return (
    <div className="node-content" ref={contentRef}>
      {name}
    </div>
  );
};

export default NodeContent; 