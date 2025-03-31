/**
 * Interpolates between two hex colors based on a factor
 * @param {string} color1 - First hex color (e.g. "#ff0000")
 * @param {string} color2 - Second hex color (e.g. "#00ff00")
 * @param {number} factor - Interpolation factor between 0 and 1
 * @returns {string} Interpolated hex color
 */
export const interpolateColor = (color1, color2, factor) => {
  // Parse the hex colors to RGB
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  // Interpolate between the colors
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}; 