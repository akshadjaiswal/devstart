/**
 * Generate project initials from project name
 * Handles various naming conventions: kebab-case, camelCase, multi-word, etc.
 *
 * @param {string} projectName - The project name
 * @returns {string} Two-letter initials in uppercase
 */
export function generateProjectInitials(projectName) {
  // Remove special characters and normalize
  const cleaned = projectName
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces/hyphens
    .trim();

  // Handle empty/invalid names - default to DevStart
  if (!cleaned) return 'DS';

  // Split by spaces, hyphens, or camelCase
  const words = cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Split camelCase: "TodoList" -> "Todo List"
    .split(/[\s-]+/) // Split by spaces and hyphens
    .filter(word => word.length > 0);

  // No words after splitting - take first 2 chars
  if (words.length === 0) {
    return cleaned.substring(0, 2).toUpperCase();
  }

  // Single word: take first 2 characters
  if (words.length === 1) {
    return cleaned.substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generate SVG favicon with project initials
 * Creates a minimalist black text on white background design
 *
 * @param {string} initials - Two-letter initials to display
 * @returns {string} SVG markup as string
 */
export function generateFaviconSVG(initials) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#ffffff"/>
  <text
    x="16"
    y="16"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="14"
    font-weight="600"
    text-anchor="middle"
    dominant-baseline="central"
    fill="#000000"
  >${initials}</text>
</svg>`;
}
