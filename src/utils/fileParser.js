/**
 * Finds the common prefix among an array of paths
 * @param {string[]} paths - Array of file paths
 * @returns {string} - Common prefix path
 */
const findCommonPrefix = (paths) => {
  if (!paths.length) return '';
  
  // Split all paths into parts
  const pathParts = paths.map(path => path.split('/'));
  
  // Find the minimum length among all paths
  const minLength = Math.min(...pathParts.map(parts => parts.length));
  
  // Compare each part at each position
  let commonPrefix = [];
  for (let i = 0; i < minLength; i++) {
    const currentPart = pathParts[0][i];
    if (pathParts.every(parts => parts[i] === currentPart)) {
      commonPrefix.push(currentPart);
    } else {
      break;
    }
  }
  
  return commonPrefix.join('/');
};

/**
 * Parses a list of file paths into a nested tree structure
 * @param {string[]} paths - Array of file paths from find command
 * @returns {Object} - Nested tree structure
 */
export const parseFilePaths = (paths) => {
  if (!paths || paths.length === 0) {
    throw new Error('No paths provided');
  }

  // Find common prefix
  const commonPrefix = findCommonPrefix(paths);
  console.log('Common prefix:', commonPrefix);

  // Create root node from common prefix
  const root = {
    name: commonPrefix || paths[0].split('/')[0],
    children: [],
    __rd3t: {
      collapsed: false,
    }
  };

  // Process each path, removing the common prefix
  paths.forEach(path => {
    // If there's a common prefix, remove it and the trailing slash
    const relativePath = commonPrefix ? path.slice(commonPrefix.length + 1) : path;
    if (!relativePath) return; // Skip if path is just the common prefix
    
    const parts = relativePath.split('/');
    let current = root;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue; // Skip empty parts
      
      // Find or create the child node
      let child = current.children.find(c => c.name === part);
      if (!child) {
        child = {
          name: part,
          children: [],
          __rd3t: {
            collapsed: true,
          }
        };
        current.children.push(child);
      }
      
      current = child;
    }
  });

  return root;
};

/**
 * Converts a text file content into a nested tree structure
 * @param {string} content - Content of the text file
 * @returns {Object} - Nested tree structure
 */
export const parseFileContent = (content) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content provided');
  }

  // Split content into lines and filter out empty lines
  const paths = content.split('\n').map(line => line.trim()).filter(line => line.trim());
  
  if (paths.length === 0) {
    throw new Error('No valid paths found in content');
  }

  return parseFilePaths(paths);
}; 