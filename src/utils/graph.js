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