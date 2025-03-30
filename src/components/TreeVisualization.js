import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import * as d3 from 'd3';
import CustomNode from './CustomNode';
import { NODE_WIDTH, NODE_HEIGHT, LEFT_CIRCLE_X, RIGHT_CIRCLE_X } from '../constants/nodeDimensions';

const TreeVisualization = ({ data, searchTerm }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const treeRef = useRef(null);

  // Expose the tree instance to window for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.treeInstance = treeRef.current;
    }
  }, []);

  console.log('TreeVisualization data:', data);

  // Function to check if a node or its children contain the search term
  const nodeContainsSearchTerm = (node) => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    
    // Check if current node contains the search term
    if (node.name.toLowerCase().includes(searchLower)) {
      return true;
    }

    // Check children recursively
    if (node.children && node.children.length > 0) {
      return node.children.some(child => nodeContainsSearchTerm(child));
    }

    return false;
  };

  // Function to get all parent nodes of a matching node
  const getParentNodes = (node, targetNode) => {
    if (!node || !targetNode) return [];
    
    if (node === targetNode) {
      return [node];
    }

    if (node.children) {
      for (const child of node.children) {
        const path = getParentNodes(child, targetNode);
        if (path.length > 0) {
          return [node, ...path];
        }
      }
    }

    return [];
  };

  // Function to find all nodes that match the search term
  const findMatchingNodes = (node) => {
    if (!node) return [];
    
    const matches = [];
    if (node.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')) {
      matches.push(node);
    }

    if (node.children) {
      node.children.forEach(child => {
        matches.push(...findMatchingNodes(child));
      });
    }

    return matches;
  };

  // Effect to handle search term changes
  /*
  useEffect(() => {
    console.log('Search term changed:', searchTerm);
    
    if (!searchTerm) {
      console.log('No search term, clearing expanded nodes');
      setExpandedNodes(new Set());
      return;
    }

    const newExpandedNodes = new Set();
    
    // Find all matching nodes
    const matchingNodes = findMatchingNodes(data);
    console.log('Found matching nodes:', matchingNodes.map(node => node.name));
    
    // For each matching node, get its parent path and add all nodes to expanded set
    matchingNodes.forEach(matchingNode => {
      const parentPath = getParentNodes(data, matchingNode);
      console.log('Parent path for node', matchingNode.name, ':', parentPath.map(node => node.name));
      parentPath.forEach(node => {
        newExpandedNodes.add(node.name);
      });
    });

    console.log('Final set of expanded nodes:', Array.from(newExpandedNodes));
    setExpandedNodes(newExpandedNodes);
  }, [searchTerm, data]);
  */
  
  // Function to determine link class based on node properties
  const getLinkClass = ({ source, target }) => {
    // You can add more complex logic here if needed
    return 'custom-tree-link';
  };
  

  useEffect(() => {
    if (!treeRef.current || !searchTerm) {
      return;
    }

    const expandNodes = async () => {
      // Get the root node of the treeRef
      const rootNode = treeRef.current.state.data[0];
      console.log('Root node:', rootNode);

      // Create d3 hierarchy from the root node
      const hierarchy = d3.hierarchy(rootNode);
      console.log('Hierarchy:', hierarchy);

      // Find all matching nodes
      const matches = hierarchy.descendants().filter(node => 
        node?.data?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('Matches:', matches);

      // Process each match sequentially
      for (const match of matches) {
        const ancestors = match.ancestors().reverse();
        console.log('Processing match:', match.data.name);
        
        // Process each ancestor sequentially
        for (const ancestor of ancestors) {
          console.log('Processing ancestor:', ancestor.data.name);
          if (ancestor.data.__rd3t.collapsed) {
            console.log('Expanding ancestor:', ancestor.data.name);
                        
            // Now we can safely call handleNodeToggle
            treeRef.current.handleNodeToggle(ancestor.data.__rd3t.id);

            // Wait for transition to complete before continuing
            await new Promise(resolve => 
              setTimeout(resolve, treeRef.current.props.transitionDuration + 50)
            );
          }
        }
      }
    };

    expandNodes();
  }, [searchTerm]);

  return (
    <div className="tree-visualization">
      <Tree
        ref={treeRef}
        data={data}
        orientation="horizontal"
        renderCustomNodeElement={(rd3tProps) => (
          <CustomNode
            {...rd3tProps}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            leftCircleX={LEFT_CIRCLE_X}
            rightCircleX={RIGHT_CIRCLE_X}
          />
        )}
        separation={{ siblings: 2, nonSiblings: 5 }}
        translate={{ x: 50, y: 50 }}
        nodeSize={{ x: 1000, y: 50 }}
        zoomable={true}
        draggable={true}
        initialDepth={2}
        transitionDuration={10}
        collapsible={true}
        pathClassFunc={getLinkClass}
        pathFunc={(linkData, orientation) => {
          const { source, target } = linkData;
          const deltaX = target.y - source.y;
          const deltaY = target.x - source.x;
          
          // Create a curved path that connects to the circles on each node
          return `M${source.y + Math.abs(LEFT_CIRCLE_X - 10)},${source.x}
                  C${source.y + deltaX * 0.5},${source.x}
                   ${source.y + deltaX * 0.5},${target.x}
                   ${target.y - Math.abs(RIGHT_CIRCLE_X)},${target.x}`;
        }}
      />
    </div>
  );
};

export default TreeVisualization; 