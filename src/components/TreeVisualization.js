import React, { useEffect, useRef, useState, forwardRef } from 'react';
import * as d3 from 'd3';
import Panzoom from '@panzoom/panzoom';
import TreeNode from './TreeNode';

const TreeVisualization = forwardRef(({ data }, ref) => {
  const svgRef = useRef(null);
  const panzoomInstanceRef = useRef(null);
  const wheelHandlerRef = useRef(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [treeData, setTreeData] = useState(null);
  const [currentTransform, setCurrentTransform] = useState(null);

  console.log('TreeVisualization data:', data);
  // Store component instance globally for console debugging
  useEffect(() => {
    window.treeVisualization = {
      getTransform: () => panzoomInstanceRef.current?.getTransform(),
      setTransform: (transform) => panzoomInstanceRef.current?.setTransform(transform),
      getScale: () => panzoomInstanceRef.current?.getScale(),
      setScale: (scale) => panzoomInstanceRef.current?.zoom(scale),
      panTo: (x, y) => panzoomInstanceRef.current?.pan(x, y),
      getExpandedNodes: () => expandedNodes,
      expandNode: (nodeName) => setExpandedNodes(prev => new Set([...prev, nodeName])),
      collapseNode: (nodeName) => setExpandedNodes(prev => {
        const next = new Set(prev);
        next.delete(nodeName);
        return next;
      }),
      getTreeData: () => treeData,
      getBBox: () => svgRef.current?.getBBox(),
    };

    return () => {
      window.treeVisualization = null;
    };
  }, [expandedNodes, treeData]);

  // Expose methods to the parent component
  // const treeRef = document.querySelector('.tree-visualization').__reactFiber$...
  React.useImperativeHandle(ref, () => ({
    // Get current transform
    getTransform: () => panzoomInstanceRef.current?.getTransform(),
    // Set transform
    setTransform: (transform) => panzoomInstanceRef.current?.setTransform(transform),
    // Get current scale
    getScale: () => panzoomInstanceRef.current?.getScale(),
    // Set scale
    setScale: (scale) => panzoomInstanceRef.current?.zoom(scale),
    // Pan to specific coordinates
    panTo: (x, y) => panzoomInstanceRef.current?.pan(x, y),
    // Get current expanded nodes
    getExpandedNodes: () => expandedNodes,
    // Expand a specific node
    expandNode: (nodeName) => setExpandedNodes(prev => new Set([...prev, nodeName])),
    // Collapse a specific node
    collapseNode: (nodeName) => setExpandedNodes(prev => {
      const next = new Set(prev);
      next.delete(nodeName);
      return next;
    }),
    // Get current tree data
    getTreeData: () => treeData,
    // Get current bounding box
    getBBox: () => svgRef.current?.getBBox(),
  }));

  // Function to determine if a node should be expanded
  const isNodeExpanded = (node) => {
    // Root node is always expanded
    if (!node.parent) return true;
    // Other nodes are expanded if they're in the expandedNodes set
    return expandedNodes.has(node.data.name);
  };

  // Function to handle node clicks
  const handleNodeClick = (node) => {
    // Don't allow expanding nodes that have no children
    if (!node.children && !node._children) {
      return;
    }

    // Store current transform before updating
    if (panzoomInstanceRef.current) {
      const pan = panzoomInstanceRef.current.getPan();
      const scale = panzoomInstanceRef.current.getScale();
      setCurrentTransform({ x: pan.x, y: pan.y, scale });
    }

    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.data.name)) {
        next.delete(node.data.name);
      } else {
        next.add(node.data.name);
      }
      return next;
    });
  };

  // Effect to handle tree layout and data updates
  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Create the root node
    const root = d3.hierarchy(data);

    // Filter nodes based on expansion state
    root.descendants().forEach(node => {
      if (!isNodeExpanded(node)) {
        // Store the original children in _children before setting children to null
        node._children = node.children;
        node.children = null;
      } else if (node._children) {
        // Restore children from _children when expanding
        node.children = node._children;
        node._children = null;
      }
    });

    // Create the tree layout with fixed vertical spacing
    const treeLayout = d3.tree()
      .nodeSize([200, 800]) // Increased vertical spacing to 800px, horizontal spacing of 200px
      .separation((a, b) => {
        // If nodes are siblings (same parent)
        if (a.parent === b.parent) {
          return 1.5; // Increased horizontal spacing between siblings
        }
        // If nodes are parent-child
        return 1.2; // Increased vertical spacing between parent and child
      });

    // Compute the tree layout
    const computedTree = treeLayout(root);
    console.log('Setting tree data with currentTransform:', currentTransform);
    setTreeData(computedTree);
  }, [data, expandedNodes]);

  useEffect(() => {
    console.log('Tree data:', treeData);
  }, [treeData]);

  /*
  // Effect to adjust SVG size after tree is rendered
  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    // Wait for the next frame to ensure the tree is rendered
    requestAnimationFrame(() => {
      const bbox = svgRef.current.getBBox();
      const padding = 100; // Add padding around the content
      
      console.log('Adjusting SVG size:', {
        bbox,
        currentWidth: svgRef.current.getAttribute('width'),
        currentHeight: svgRef.current.getAttribute('height')
      });
      
      // Set SVG dimensions to match content plus padding
      svgRef.current.setAttribute('width', bbox.width + padding * 2);
      svgRef.current.setAttribute('height', bbox.height + padding * 2);
      
      // Adjust the g element's transform to account for padding
      const gElement = svgRef.current.querySelector('g');
      if (gElement) {
        gElement.setAttribute('transform', `translate(${padding - bbox.x}, ${padding - bbox.y})`);
      }

      // Log the new dimensions
      console.log('New SVG dimensions:', {
        width: svgRef.current.getAttribute('width'),
        height: svgRef.current.getAttribute('height'),
        newBBox: svgRef.current.getBBox()
      });
    });
  }, [treeData]);
  */

  // Effect to handle panzoom initialization
  useEffect(() => {
    if (!svgRef.current) return;

    // Log initial SVG dimensions and position
    console.log('SVG Initial dimensions:', {
      width: svgRef.current.clientWidth,
      height: svgRef.current.clientHeight,
      offsetWidth: svgRef.current.offsetWidth,
      offsetHeight: svgRef.current.offsetHeight,
      getBoundingClientRect: svgRef.current.getBoundingClientRect(),
      getBBox: svgRef.current.getBBox()
    });

    // Initialize panzoom with proper options for dragging
    const panzoomInstance = Panzoom(svgRef.current, {
        contain: 'inside',
        canvas: true,
        startScale: 1,
        setTransform: (elem, { x, y, scale }) => {
        elem.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        console.log('Panzoom transform updated:', { x, y, scale });
        }
    });

    // Store the instance in our ref
    panzoomInstanceRef.current = panzoomInstance;

    // Add event listeners for panzoom events
    if (svgRef.current) {
      svgRef.current.addEventListener('panzoomchange', (event) => {
        console.log('Panzoom change:', {
          x: event.detail.x,
          y: event.detail.y,
          scale: event.detail.scale
        });
      });

      svgRef.current.addEventListener('panzoompan', (event) => {
        const bbox = svgRef.current.getBBox();
        const container = svgRef.current.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        console.log('Panzoom pan:', {
          x: event.detail.x,
          y: event.detail.y,
          bbox,
          containerRect,
          scale: panzoomInstance.getScale(),
          // Log the current options
          options: panzoomInstance.getOptions(),
          // Log the current pan position
          pan: panzoomInstance.getPan()
        });
      });

      svgRef.current.addEventListener('panzoomzoom', (event) => {
        console.log('Panzoom zoom:', {
          scale: event.detail.scale
        });
      });
    }

    // Add wheel listener for zooming with scale logging
    if (svgRef.current && svgRef.current.parentElement) {
      wheelHandlerRef.current = (event) => {
        panzoomInstance.zoomWithWheel(event);
        console.log('Current scale:', panzoomInstance.getScale());
      };
      svgRef.current.parentElement.addEventListener('wheel', wheelHandlerRef.current);
    }

    // Cleanup
    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('panzoomchange', null);
        svgRef.current.removeEventListener('panzoompan', null);
        svgRef.current.removeEventListener('panzoomzoom', null);
      }
      if (svgRef.current && svgRef.current.parentElement && wheelHandlerRef.current) {
        svgRef.current.parentElement.removeEventListener('wheel', wheelHandlerRef.current);
      }
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.destroy();
      }
    };
  }, []);

  /*
  // Effect to center the visualization when tree data changes
  useEffect(() => {
    if (!treeData || !svgRef.current || !panzoomInstanceRef.current) return;

    // Wait for the next frame to ensure the SVG has been rendered
    requestAnimationFrame(() => {
      // If we have a stored transform from a node click, restore it
      if (currentTransform) {
        console.log('Restoring stored transform:', currentTransform);
        // Apply the stored transform directly
        panzoomInstanceRef.current.pan(currentTransform.x, currentTransform.y);
        panzoomInstanceRef.current.zoom(currentTransform.scale);
        setCurrentTransform(null);
        return;
      }

      // Otherwise, center the tree on initial render
      const width = window.innerWidth;
      const height = window.innerHeight;
      const bbox = svgRef.current.getBBox();
      
      console.log('TSP Window dimensions:', { width, height });
      console.log('TSP Bounding box:', bbox);
      
      // Calculate the scale needed to fit the entire tree
      const scaleX = (width - 500) / bbox.width;  // Leave 250px padding on each side
      const scaleY = (height - 500) / bbox.height; // Leave 250px padding on top and bottom
      
      console.log('TSP Scales:', { scaleX, scaleY });
      
      // If content is wider or taller than window, ensure we scale down enough to fit
      const scale = Math.min(scaleX, scaleY);
      
      // Calculate the center position
      const x = (width - (bbox.width * scale)) / 2;
      const y = (height - (bbox.height * scale)) / 2;
      
      console.log('TSP Final transform:', { x, y, scale });
      
      // Apply the transform
      console.log('Applying pan:', { x, y });
      panzoomInstanceRef.current.pan(x, y);
      
      // Wait a frame before applying zoom to ensure pan is complete
      requestAnimationFrame(() => {
        console.log('Applying zoom:', { scale });
        panzoomInstanceRef.current.zoom(scale);
      });
    });
  }, [treeData, currentTransform]);
  */

  return (
    <div className="tree-visualization">
      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Add BBox visualization */}
        {svgRef.current && false && ( // disable outline
          <rect
            className="bbox-visualization"
            x={svgRef.current.getBBox().x}
            y={svgRef.current.getBBox().y}
            width={svgRef.current.getBBox().width}
            height={svgRef.current.getBBox().height}
            fill="none"
            stroke="blue"
            strokeWidth="2"
            strokeDasharray="5,5"
            pointerEvents="none"
          />
        )}
        <g transform="translate(100, 50)">
          {/* Render links */}
          {treeData && treeData.links().map((link, i) => (
            <path
              key={i}
              className="link"
              d={d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x)(link)}
              fill="none"
              stroke="#ccc"
              strokeWidth={2}
              pointerEvents="none"
            />
          ))}
          
          {/* Render nodes */}
          {treeData && treeData.descendants().map((node, i) => (
            <TreeNode
              key={i}
              node={node}
              onClick={handleNodeClick}
              isExpanded={isNodeExpanded(node)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default TreeVisualization; 