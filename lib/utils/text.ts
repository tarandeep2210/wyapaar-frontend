/**
 * Text utility functions for cleaning and formatting text content
 */

/**
 * Strip HTML tags and decode HTML entities from a string
 * @param html - The HTML string to clean
 * @returns Clean text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // First pass: Remove all HTML tags (including self-closing ones)
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags and content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags and content
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments
  
  // Second pass: Decode HTML entities (comprehensive list)
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ') // Non-breaking space
    .replace(/&amp;/g, '&') // Ampersand
    .replace(/&lt;/g, '<') // Less than
    .replace(/&gt;/g, '>') // Greater than
    .replace(/&quot;/g, '"') // Double quote
    .replace(/&#39;/g, "'") // Single quote (numeric)
    .replace(/&apos;/g, "'") // Single quote (named)
    .replace(/&hellip;/g, '...') // Horizontal ellipsis
    .replace(/&mdash;/g, '—') // Em dash
    .replace(/&ndash;/g, '–') // En dash
    .replace(/&rsquo;/g, "'") // Right single quote
    .replace(/&lsquo;/g, "'") // Left single quote
    .replace(/&rdquo;/g, '"') // Right double quote
    .replace(/&ldquo;/g, '"') // Left double quote
    .replace(/&cent;/g, '¢') // Cent sign
    .replace(/&pound;/g, '£') // Pound sign
    .replace(/&yen;/g, '¥') // Yen sign
    .replace(/&euro;/g, '€') // Euro sign
    .replace(/&copy;/g, '©') // Copyright
    .replace(/&reg;/g, '®') // Registered trademark
    .replace(/&trade;/g, '™') // Trademark
    .replace(/&deg;/g, '°') // Degree symbol
    .replace(/&plusmn;/g, '±') // Plus-minus
    .replace(/&times;/g, '×') // Multiplication
    .replace(/&divide;/g, '÷') // Division
    .replace(/&frac12;/g, '½') // One half
    .replace(/&frac14;/g, '¼') // One quarter
    .replace(/&frac34;/g, '¾') // Three quarters
    .replace(/&bull;/g, '\u2022') // Bullet point
    .replace(/&middot;/g, '\u00B7') // Middle dot
    .replace(/&lsaquo;/g, '\u2039') // Left-pointing single angle quotation mark
    .replace(/&rsaquo;/g, '\u203A') // Right-pointing single angle quotation mark
    .replace(/&laquo;/g, '\u00AB') // Left-pointing double angle quotation mark
    .replace(/&raquo;/g, '\u00BB') // Right-pointing double angle quotation mark
    .replace(/&dagger;/g, '\u2020') // Dagger
    .replace(/&Dagger;/g, '\u2021') // Double dagger
    .replace(/&permil;/g, '\u2030') // Per mille sign
    .replace(/&lsquo;/g, '\u2018') // Left single quotation mark
    .replace(/&rsquo;/g, '\u2019') // Right single quotation mark
    .replace(/&ldquo;/g, '\u201C') // Left double quotation mark
    .replace(/&rdquo;/g, '\u201D') // Right double quotation mark
    .replace(/&sbquo;/g, '\u201A') // Single low-9 quotation mark
    .replace(/&bdquo;/g, '\u201E') // Double low-9 quotation mark
    .replace(/&iexcl;/g, '\u00A1') // Inverted exclamation mark
    .replace(/&iquest;/g, '\u00BF') // Inverted question mark
    .replace(/&sect;/g, '\u00A7') // Section sign
    .replace(/&para;/g, '\u00B6') // Pilcrow sign
    .replace(/&acute;/g, '\u00B4') // Acute accent
    .replace(/&cedil;/g, '\u00B8') // Cedilla
    .replace(/&uml;/g, '\u00A8') // Diaeresis
    .replace(/&macr;/g, '\u00AF') // Macron
    // Handle numeric entities (&#xxx; and &#xxxx;)
    .replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num, 10)))
    // Handle hex entities (&#xXX; and &#xXXXX;)
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  // Third pass: Clean up whitespace and formatting
  cleaned = cleaned
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n') // Convert remaining \r to \n
    .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with max 2
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
    .trim();
  
  return cleaned;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the text
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Clean and truncate HTML content for display
 * @param html - The HTML content to clean and truncate
 * @param maxLength - Maximum length of the cleaned text
 * @returns Clean, truncated text
 */
export function cleanAndTruncateHtml(html: string, maxLength: number = 150): string {
  const cleanText = stripHtmlTags(html);
  return truncateText(cleanText, maxLength);
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case
 * @param str - The string to convert
 * @returns String in title case
 */
export function toTitleCase(str: string): string {
  if (!str) return str;
  
  return str.toLowerCase().split(' ').map(word => 
    capitalizeFirstLetter(word)
  ).join(' ');
}
