// Node container dimensions
export const NODE_WIDTH = 400;
export const NODE_HEIGHT = 100;

// Padding dimensions
export const NODE_PADDING_X = 16;  // 8px on each side
export const NODE_PADDING_Y = 10;  // 5px on top and bottom
export const NODE_PADDING_LEFT = 8;
export const NODE_PADDING_RIGHT = 8;
export const NODE_PADDING_TOP = 5;
export const NODE_PADDING_BOTTOM = 5;

// Circle dimensions and positions
export const LEFT_CIRCLE_RADIUS = 4;
export const RIGHT_CIRCLE_RADIUS = 6;
export const LEFT_CIRCLE_STROKE_WIDTH = 2;
export const RIGHT_CIRCLE_STROKE_WIDTH = 2;
export const LEFT_CIRCLE_FILL = '#3E3F5B';
export const RIGHT_CIRCLE_FILL = '#ACD3A8';
export const LEFT_CIRCLE_STROKE = '#3E3F5B';
export const RIGHT_CIRCLE_STROKE = '#8AB2A6';

// Node colors
export const NODE_BACKGROUND = '#ffffff';
export const NODE_BORDER_COLOR = '#3E3F5B';
export const NODE_BORDER_WIDTH = '2px';
export const NODE_BORDER_RADIUS = '8px';
export const NODE_BOX_SHADOW = '0 2px 8px rgba(0, 0, 0, 0.3)';
export const NODE_TEXT_COLOR = '#2d3748';
export const NODE_TEXT_FONT_FAMILY = 'Menlo, Monaco, Courier New, monospace';
export const NODE_TEXT_FONT_SIZE = '24px';

export const NODE_COLOR_MIN = '#DDEB9D';
export const NODE_COLOR_MAX = '#EB5B00';

// Circle positions relative to node center
// Account for node width (180) and padding (16px on each side)
export const LEFT_CIRCLE_X = -(NODE_WIDTH / 2 + NODE_PADDING_LEFT + 2);  // Half of node width + left padding + small gap
export const RIGHT_CIRCLE_X = NODE_WIDTH / 2 + NODE_PADDING_RIGHT + 2;   // Half of node width + right padding + small gap

// Node container position relative to circles
// Position the node container so it's centered between the circles
// Left edge at -92, right edge at 72 (-92 + 164), creating equal spacing
export const NODE_X_OFFSET = -(NODE_WIDTH / 2);
export const NODE_Y_OFFSET = -(NODE_HEIGHT / 2); // Center vertically 