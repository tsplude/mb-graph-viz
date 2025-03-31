import * as d3 from 'd3';

/**
 * Filters a tree structure based on a search term, marking matching nodes and their ancestors
 * as included, and removing non-matching nodes from the tree.
 * @param {Object} treeData - The root node of the tree structure
 * @param {string} searchTerm - The search term to filter by
 * @returns {Object} - A new tree structure with only matching nodes and their ancestors
 */
export const filterByMatch = (treeData, searchTerm) => {
  if (!searchTerm) return treeData;
  
  const searchLower = searchTerm.toLowerCase();
  
  // Create a deep copy of the tree to avoid mutating the original
  const treeCopy = JSON.parse(JSON.stringify(treeData));
  
  // Create d3 hierarchy
  const hierarchy = d3.hierarchy(treeCopy);
  
  // First pass: Mark matching nodes and their ancestors as included
  const matchingNodes = hierarchy.descendants().filter(node => 
    node.data.name.toLowerCase().includes(searchLower)
  );
  // Track included nodes
  const includedNodes = new Set();
  
  // Mark all matching nodes and their ancestors as included
  matchingNodes.forEach(matchingNode => {
    // Mark the matching node
    matchingNode.data.included = true;
    if (!matchingNode.data.__rd3t) {
      matchingNode.data.__rd3t = {};
    }
    matchingNode.data.__rd3t.collapsed = false;
    includedNodes.add(matchingNode.data.name);
    
    // Mark all ancestors
    matchingNode.ancestors().forEach(ancestor => {
      ancestor.data.included = true;
      if (!ancestor.data.__rd3t) {
        ancestor.data.__rd3t = {};
      }
      ancestor.data.__rd3t.collapsed = false;
      includedNodes.add(ancestor.data.name);
    });

    // Mark all children as included
    matchingNode.data.children.forEach(child => {
      child.included = true;
      if (!child.__rd3t) {
        child.__rd3t = {};
      }
      child.__rd3t.collapsed = false;
      includedNodes.add(child.name);
    });
  });
  
  // Second pass: Remove non-included nodes
  let removedCount = 0;
  const removeNonIncludedNodes = (node) => {
    if (!node) return null;
    
    // If node is not included, return null to remove it
    if (!node.included) {
      removedCount++;
      return null;
    }
    
    // Process children if they exist
    if (node.children && node.children.length > 0) {
      node.children = node.children
        .map(child => removeNonIncludedNodes(child))
        .filter(child => child !== null);
    }
    
    // Remove the included flag before returning
    delete node.included;
    return node;
  };
  
  // Remove non-included nodes and return the filtered tree
  const result = removeNonIncludedNodes(treeCopy);
  console.log(`Filtering complete: ${includedNodes.size} nodes included, ${removedCount} nodes removed`);
  return result;
};

/**
 * Filters tree data based on trace data paths
 * @param {Object} treeData - The tree data to filter
 * @param {Object} traceData - The trace data containing namespace paths
 * @returns {Object} Filtered tree data
 */
export const filterByTrace = (treeData, traceData) => {
  if (!traceData) return treeData;

  // Skip the root node if it has a single child named "metabase"
  if (treeData.children?.length === 1 && treeData.children[0].name === "metabase") {
    treeData = treeData.children[0];
  }

  // Create a deep copy of the tree to avoid mutating the original
  const treeCopy = JSON.parse(JSON.stringify(treeData));

  // Create d3 hierarchy for ancestor traversal
  const hierarchy = d3.hierarchy(treeCopy);

  // Helper function to find a node by path
  const findNodeByPath = (d3node, pathParts, currentIndex = 0) => {
    if (currentIndex >= pathParts.length) return d3node;
    if (!d3node.children) return null;
    if (d3node.data.name === pathParts[currentIndex]) {
      return findNodeByPath(d3node, pathParts, currentIndex + 1);
    }
    
    let matchingChild;
    
    // For the final part of the path, try matching with different file extensions
    if (currentIndex === pathParts.length - 1) {
      const possibleExtensions = ["", ".clj", ".cljs", ".cljc"];
      matchingChild = d3node.children.find(child => 
        possibleExtensions.some(ext => child.data.name === pathParts[currentIndex] + ext)
      );
    } else {
      matchingChild = d3node.children.find(child => child.data.name === pathParts[currentIndex]);
    }

    if (!matchingChild) return null;
    return findNodeByPath(matchingChild, pathParts, currentIndex + 1);
  };

  // Helper function to mark a node and its ancestors as included
  const markIncludedNodes = (d3node) => {
    if (!d3node) return;
    
    // Mark this node as included
    d3node.data.__rd3t = d3node.data.__rd3t || {};
    d3node.data.__rd3t.collapsed = false;
    d3node.data.__rd3t.included = true;

    // Mark all ancestors as included using d3's ancestors()
    d3node.ancestors().forEach(ancestor => {
      ancestor.data.__rd3t = ancestor.data.__rd3t || {};
      ancestor.data.__rd3t.collapsed = false;
      ancestor.data.__rd3t.included = true;
    });
  };

  // Process each namespace in traceData
  Object.entries(traceData).forEach(([namespace, data]) => {
    const namespaceParts = namespace.split('.').map(part => part.replace('-', '_'));
    
    // Find the node corresponding to this namespace path
    const d3node = findNodeByPath(hierarchy, namespaceParts);
    
    if (!d3node) {
      console.error(`No matching node found for namespace path: ${namespace}`);
      return;
    }

    // Add trace data to the node
    d3node.data.traceData = { ...data };

    // Mark the node and its ancestors as included
    markIncludedNodes(d3node);
  });

  // Remove non-included nodes
  const removeNonIncludedNodes = (d3node) => {
    if (!d3node) return null;

    // If this node is not included, return null to remove it
    if (!d3node.data.__rd3t?.included) {
      return null;
    }

    // Create a new node with the same data
    const newNode = {
      ...d3node.data,
      children: []
    };

    // Process children if they exist
    if (d3node.children) {
      newNode.children = d3node.children
        .map(child => removeNonIncludedNodes(child))
        .filter(child => child !== null);
    }

    return newNode;
  };

  const filteredTree = removeNonIncludedNodes(hierarchy);

  // Propagate trace data up the tree
  const propagateTraceData = (node, minSoFar = Infinity, maxSoFar = -Infinity) => {
    if (!node) return { min: minSoFar, max: maxSoFar };

    // Initialize traceData if it doesn't exist
    node.traceData = node.traceData || { total_n_calls: 0 };

    // Update min/max with this node's value if it's a leaf
    if (!node.children || node.children.length === 0) {
      const currentCalls = node.traceData.total_n_calls;
      return {
        min: Math.min(minSoFar, currentCalls),
        max: Math.max(maxSoFar, currentCalls)
      };
    }

    // Process children and get their min/max values
    let currentMin = minSoFar;
    let currentMax = maxSoFar;
    let totalCalls = 0;

    node.children.forEach(child => {
      const { min, max } = propagateTraceData(child, currentMin, currentMax);
      currentMin = Math.min(currentMin, min);
      currentMax = Math.max(currentMax, max);
      totalCalls += child.traceData.total_n_calls;
    });

    // Update node's traceData with statistics
    node.traceData.total_n_calls = totalCalls;
    node.traceData.min_n_calls = currentMin;
    node.traceData.max_n_calls = currentMax;

    return { min: currentMin, max: currentMax };
  };

  // Start propagation from root
  propagateTraceData(filteredTree);
  return filteredTree;
}; 