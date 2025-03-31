/**
 * Parses a trace file content into a nested map structure representing function calls and their returns
 * @param {string} content - Content of the trace file
 * @returns {Object} A map containing namespaces, their functions, and call traces
 */
export const parseTraceFile = (content) => {
  const namespaceMap = {};
  const namespaceStack = [];

  // Helper function to parse a function call line
  const parseFunctionCall = (line, lineNum) => {
    // Extract trace ID and content
    const [traceId, content] = line.split(':').map(s => s.trim());
    // Clean up trace ID by removing "TRACE " prefix
    const cleanTraceId = traceId.replace('TRACE ', '');
    
    // Count depth by counting '|' characters
    const depth = (content.match(/\|/g) || []).length;
    
    // Extract the function call part (everything after the last '|' or the start)
    const callPart = content.split('|').pop().trim();
    
    // Extract namespace and function name from the call part
    const match = callPart.match(/\(([^/]+)\/([^)]+)\)/);
    if (!match) return null;
    
    const [, namespace, functionName] = match;
    
    // Create or get namespace
    if (!namespaceMap[namespace]) {
      namespaceMap[namespace] = {
        file_prefix: namespace.replace(/\./g, '/'),
        functions: {}
      };
    }
    
    // Create or get function
    if (!namespaceMap[namespace].functions[functionName]) {
      namespaceMap[namespace].functions[functionName] = {
        name: functionName,
        calls: {}
      };
    }
    
    // Add call information
    namespaceMap[namespace].functions[functionName].calls[cleanTraceId] = {
      line_num: lineNum,
      trace_id: cleanTraceId,
      depth: depth,
      returned: {}
    };
    
    // Push to stack for return value matching
    namespaceStack.push({
      trace_id: cleanTraceId,
      namespace,
      function_name: functionName
    });
  };

  // Helper function to parse a return value line
  const parseReturnValue = (line) => {
    if (namespaceStack.length === 0) return;
    
    const [traceId, content] = line.split(':').map(s => s.trim());
    // Clean up trace ID by removing "TRACE " prefix
    const cleanTraceId = traceId.replace('TRACE ', '');
    const depth = (content.match(/\|/g) || []).length;
    const value = content.split('=>')[1].trim();
    
    // Find matching call in stack
    const stackItem = namespaceStack.pop();
    if (stackItem && stackItem.trace_id === cleanTraceId) {
      const { namespace, function_name } = stackItem;
      namespaceMap[namespace].functions[function_name].calls[cleanTraceId].returned = {
        value,
        trace_id: cleanTraceId
      };
    }
  };

  // Process the content line by line
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    if (line.includes('=>')) {
      parseReturnValue(line);
    } else {
      parseFunctionCall(line, index + 1);
    }
  });

  // Add call count statistics
  Object.values(namespaceMap).forEach(namespace => {
    let totalCalls = 0;
    Object.values(namespace.functions).forEach(func => {
      func.n_calls = Object.keys(func.calls).length;
      totalCalls += func.n_calls;
    });
    namespace.total_n_calls = totalCalls;
  });

  return namespaceMap;
};