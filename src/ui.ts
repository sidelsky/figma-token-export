// UI logic for the Design Token Export plugin
import {
  ExportData,
  ExportFormat,
  UIMessage,
  PluginMessage,
  DeveloperExportData,
} from './types';

console.log('UI script starting to execute...');

// Global state
let exportedData: ExportData | null = null;

// DOM elements
let exportBtn: HTMLButtonElement;
let downloadBtn: HTMLButtonElement;
let copyBtn: HTMLButtonElement;
let closeBtn: HTMLButtonElement;
let status: HTMLDivElement;
let previewSection: HTMLDivElement;
let previewContent: HTMLPreElement;
let previewTitle: HTMLDivElement;

// Initialize plugin after DOM is ready
function initializePlugin(): void {
  console.log('initializePlugin called');

  // Get DOM elements with type safety
  exportBtn = getElementById('exportBtn') as HTMLButtonElement;
  downloadBtn = getElementById('downloadBtn') as HTMLButtonElement;
  copyBtn = getElementById('copyBtn') as HTMLButtonElement;
  closeBtn = getElementById('closeBtn') as HTMLButtonElement;
  status = getElementById('status') as HTMLDivElement;
  previewSection = getElementById('previewSection') as HTMLDivElement;
  previewContent = getElementById('previewContent') as HTMLPreElement;
  previewTitle = getElementById('previewTitle') as HTMLDivElement;

  console.log('All DOM elements found, setting up event listeners...');

  // Event listeners
  exportBtn.addEventListener('click', handleExport);
  downloadBtn.addEventListener('click', handleDownload);
  copyBtn.addEventListener('click', handleCopy);
  closeBtn.addEventListener('click', handleClose);

  // Set initial button text
  updateDownloadButtonText();

  // Add event listener for format select dropdown
  const formatSelect = getElementById('exportFormat') as HTMLSelectElement;
  formatSelect.addEventListener('change', () => {
    console.log('Export format changed to:', formatSelect.value);
    updateDownloadButtonText();
    if (exportedData) {
      updatePreviewContent();
    }
  });

  // Listen for messages from plugin code
  window.onmessage = (
    event: MessageEvent<{ pluginMessage: PluginMessage }>
  ) => {
    console.log('Received message:', event.data);

    if (!event.data.pluginMessage) return;

    const { type, data, message } = event.data.pluginMessage;

    switch (type) {
      case 'tokens-extracted':
        if (data) {
          handleTokensExtracted(data);
        }
        break;

      case 'error':
        handleError(message || 'Unknown error occurred');
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  };

  console.log('✅ Plugin UI initialized successfully!');
}

/**
 * Safe element getter with error handling
 */
function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

/**
 * Handle successful token extraction
 */
function handleTokensExtracted(data: ExportData): void {
  exportBtn.disabled = false;
  exportBtn.textContent = 'Export Design Tokens';
  updateDownloadButtonText();

  const collectionCount = Object.keys(data.collections).length;
  showStatus(
    'success',
    `Successfully extracted ${collectionCount} collection(s)!`
  );
  showPreview(data);
}

/**
 * Handle extraction errors
 */
function handleError(message: string): void {
  exportBtn.disabled = false;
  exportBtn.textContent = 'Export Design Tokens';
  showStatus('error', `Error: ${message}`);
}

/**
 * Handle export button click
 */
function handleExport(): void {
  console.log('Starting export process...');
  showStatus('loading', 'Extracting design tokens...');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';

  const message: UIMessage = { type: 'export-tokens' };
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Get the currently selected export format
 */
function getSelectedFormat(): ExportFormat {
  const formatSelect = document.getElementById(
    'exportFormat'
  ) as HTMLSelectElement;

  if (formatSelect) {
    return formatSelect.value as ExportFormat;
  }

  return 'json'; // default fallback
}

/**
 * Convert JSON data to CSS custom properties
 */
function convertToCSS(data: ExportData): string {
  let css = '/* Design Tokens exported from Figma */\n';
  css += `/* Exported at: ${data.metadata.exportedAt} */\n`;
  css += `/* File: ${data.metadata.figmaFileKey || 'Unknown'} */\n`;
  css += `/* Collections: ${Object.keys(data.collections).join(', ')} */\n\n`;

  // Add usage examples
  const modeNames = [
    ...new Set(
      Object.values(data.collections).flatMap(collection =>
        Object.values(collection.variables).flatMap(variable =>
          Object.keys(variable.values)
        )
      )
    ),
  ];

  css += '/* Usage Examples:\n';
  css += ' * .button { background: var(--colors-primary); }\n';
  css += ' * .text { font-size: var(--typography-body-size); }\n';

  if (modeNames.length > 1) {
    const darkMode =
      modeNames.find(mode => mode !== 'Default' && mode !== 'Light') ||
      modeNames[1];
    css += ` * Toggle themes: document.body.setAttribute("data-theme", "${darkMode}"); */\n\n`;
  } else {
    css += ' */\n\n';
  }

  // Group variables by mode
  const modeGroups: Record<string, string[]> = {};

  Object.entries(data.collections).forEach(([collectionName, collection]) => {
    Object.entries(collection.variables).forEach(([varName, variable]) => {
      // Process direct values
      Object.entries(variable.values).forEach(([modeName, value]) => {
        if (!modeGroups[modeName]) {
          modeGroups[modeName] = [];
        }

        const cssVarName =
          `--${collectionName.toLowerCase()}-${varName.toLowerCase()}`.replace(
            /[^a-z0-9-]/g,
            '-'
          );
        const cssValue = formatValueForCSS(value, variable.type);
        const comment = variable.description
          ? ` /* ${variable.description} */`
          : '';

        modeGroups[modeName].push(`  ${cssVarName}: ${cssValue};${comment}`);
      });

      // Process aliases
      Object.entries(variable.aliases).forEach(([modeName, alias]) => {
        if (!modeGroups[modeName]) {
          modeGroups[modeName] = [];
        }

        const cssVarName =
          `--${collectionName.toLowerCase()}-${varName.toLowerCase()}`.replace(
            /[^a-z0-9-]/g,
            '-'
          );
        const aliasName = alias.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const comment = ` /* alias to ${alias.name} */`;

        modeGroups[modeName].push(
          `  ${cssVarName}: var(--${aliasName});${comment}`
        );
      });
    });
  });

  // Generate CSS for each mode
  Object.entries(modeGroups).forEach(([modeName, variables]) => {
    if (
      modeName === 'Default' ||
      modeName === 'Light' ||
      Object.keys(modeGroups).length === 1
    ) {
      css += ':root {\n';
      css += `  /* Mode: ${modeName} */\n`;
    } else {
      css += `[data-theme="${modeName}"] {\n`;
      css += `  /* Mode: ${modeName} */\n`;
    }

    css += variables.join('\n') + '\n';
    css += '}\n\n';
  });

  return css;
}

/**
 * Format value for CSS output
 */
function formatValueForCSS(value: any, type: string): string {
  switch (type) {
    case 'COLOR':
      return String(value);

    case 'FLOAT':
      // Add px unit for likely spacing/sizing values
      if (
        typeof value === 'number' &&
        value > 0 &&
        value < 1000 &&
        Number.isInteger(value)
      ) {
        return `${value}px`;
      }
      return String(value);

    case 'STRING':
      return `"${value}"`;

    case 'BOOLEAN':
      return value ? '1' : '0';

    default:
      return String(value);
  }
}

/**
 * Convert to W3C Design Tokens Community Group format
 * Creates a simplified, developer-friendly structure
 */
function convertToDeveloperFormat(data: ExportData): DeveloperExportData {
  const result: DeveloperExportData = {};

  // Process each collection
  Object.entries(data.collections).forEach(([collectionName, collection]) => {
    // Determine category based on collection name or variable types
    const category = categorizeCollection(collectionName);

    // Initialize category if it doesn't exist
    if (!result[category]) {
      result[category] = {};
    }

    // Process each variable in the collection
    Object.entries(collection.variables).forEach(([varName, variable]) => {
      // Get the primary value (prefer Default mode, or first available mode)
      const primaryMode =
        collection.modes.find(
          m => m.name === 'Default' || m.name === 'Light'
        ) || collection.modes[0];

      if (!primaryMode) return; // Skip if no modes available

      const primaryModeName = primaryMode.name;

      let value = variable.values[primaryModeName];

      // If no direct value, check for alias
      if (value === undefined && variable.aliases[primaryModeName]) {
        value = `{${variable.aliases[primaryModeName].name}}`;
      }

      // Skip if still no value
      if (value === undefined) return;

      // Create the token object
      const token: any = {
        $type: mapFigmaTypeToW3C(variable.type),
        $value: value,
      };

      // Add description if available
      if (variable.description) {
        token.$description = variable.description;
      }

      // Parse variable name to create nested structure
      const tokenPath = parseTokenName(varName);
      setNestedValue(result[category], tokenPath, token);
    });
  });

  return result;
}

/**
 * Categorize a collection into a standard category
 */
function categorizeCollection(collectionName: string): string {
  const name = collectionName.toLowerCase();

  // Map common collection names to standard categories
  // Return lowercase/hyphenated strings - camelCase conversion happens later
  if (name.includes('color') || name.includes('colour')) return 'colors';
  if (name.includes('spacing') || name.includes('space')) return 'spacing';
  if (
    name.includes('typography') ||
    name.includes('font') ||
    name.includes('text')
  )
    return 'typography';
  if (name.includes('radius') || name.includes('border'))
    return 'border-radius';
  if (name.includes('shadow')) return 'shadows';
  if (name.includes('size') || name.includes('sizing')) return 'sizing';
  if (name.includes('opacity') || name.includes('alpha')) return 'opacity';
  if (name.includes('duration') || name.includes('timing')) return 'animation';

  // Default: use the collection name as-is (lowercase, no spaces)
  return collectionName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Map Figma variable types to W3C Design Token types
 */
function mapFigmaTypeToW3C(figmaType: string): string {
  switch (figmaType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'number';
    case 'STRING':
      return 'string';
    case 'BOOLEAN':
      return 'boolean';
    default:
      return figmaType.toLowerCase();
  }
}

/**
 * Parse a token name into a path array
 * Examples:
 *   "primary" -> ["primary"]
 *   "text/primary" -> ["text", "primary"]
 *   "button-primary" -> ["button", "primary"]
 */
function parseTokenName(name: string): string[] {
  // Split by common separators: /, -, _, or camelCase
  let parts: string[] = [];

  // First, split by / (most explicit separator)
  if (name.includes('/')) {
    parts = name.split('/');
  } else if (name.includes('-')) {
    // Split by dash
    parts = name.split('-');
  } else if (name.includes('_')) {
    // Split by underscore
    parts = name.split('_');
  } else {
    // Try to split camelCase
    parts = name.split(/(?=[A-Z])/);

    // If no camelCase detected, use the whole name
    if (parts.length === 1) {
      parts = [name];
    }
  }

  // Clean up parts - don't lowercase, let toCamelCase handle it
  return parts.map(p => p.trim()).filter(p => p.length > 0);
}

/**
 * Set a value in a nested object using a path array
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  if (path.length === 0) return;

  const key = path[0];
  if (!key) return; // Type guard for undefined

  if (path.length === 1) {
    obj[key] = value;
    return;
  }

  const [first, ...rest] = path;
  if (!first) return; // Type guard for undefined

  if (!obj[first]) {
    obj[first] = {};
  }

  setNestedValue(obj[first], rest, value);
}

/**
 * Resolve a variable's value, handling aliases and mode fallbacks
 */
function resolveValue(
  variable: any,
  modeName: string,
  data: ExportData,
  visited: Set<string> = new Set()
): any {
  // Prevent infinite loops
  if (visited.has(variable.name)) {
    console.warn('Circular alias detected for:', variable.name);
    return undefined;
  }
  visited.add(variable.name);

  // If there's a direct value, return it
  if (variable.values && variable.values[modeName] !== undefined && variable.values[modeName] !== null) {
    return variable.values[modeName];
  }

  // If there's an alias, resolve it
  if (variable.aliases && variable.aliases[modeName]) {
    const aliasName = variable.aliases[modeName].name;
    
    // Search all collections for the aliased variable
    for (const collName in data.collections) {
      const coll = data.collections[collName];
      if (coll && coll.variables && coll.variables[aliasName]) {
        const aliasedVar = coll.variables[aliasName];
        // Recursively resolve in case the alias points to another alias
        const resolvedValue = resolveValue(aliasedVar, modeName, data, visited);
        if (resolvedValue !== undefined && resolvedValue !== null) {
          return resolvedValue;
        }
      }
    }
  }

  // If mode not found, try the first available mode as fallback
  if (variable.values) {
    const firstMode = Object.keys(variable.values)[0];
    if (firstMode && variable.values[firstMode] !== undefined && variable.values[firstMode] !== null) {
      return variable.values[firstMode];
    }
  }

  return undefined;
}

/**
 * Convert to React Native flattened format
 * Removes all $ metadata, preserves structure, renames borderRadius → radius
 */
function convertToReactNative(data: ExportData): string {
  // Helper: Convert string to camelCase only if it has separators
  function toCamelCaseRN(str: string): string {
    str = str.trim();

    // If string has no separators (hyphens, underscores, spaces), return as-is
    if (!/[-_\s]/.test(str)) {
      return str;
    }

    // Otherwise, convert to camelCase
    return str
      .replace(/[^\w\s-]/g, '') // Remove special chars except word chars, spaces, hyphens
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^[A-Z]/, c => c.toLowerCase())
      .replace(/^\d/, match => '_' + match); // Prefix numbers with underscore
  }

  // Helper: Filter RN-safe values
  function isRNSafe(value: any, key: string): boolean {
    // Skip null/undefined
    if (value === null || value === undefined) {
      return false;
    }
    
    // Remove boolean values for non-style keys like "detail", "subtitle"
    if (
      typeof value === 'boolean' &&
      (key === 'detail' || key === 'subtitle')
    ) {
      return false;
    }
    // Keep strings, numbers, objects (but not null since we checked above)
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'object'
    );
  }

  const tokens: Record<string, any> = {};

  // Process each collection
  Object.entries(data.collections).forEach(([collectionName, collection]) => {
    // Use collection name as-is, just convert to camelCase
    const camelCategory = toCamelCaseRN(collectionName);

    if (!tokens[camelCategory]) {
      tokens[camelCategory] = {};
    }

    // Process each variable in the collection
    Object.entries(collection.variables).forEach(([varName, variable]) => {
      // Get the primary mode value (Default or first available)
      const primaryMode =
        collection.modes.find(
          m => m.name === 'Default' || m.name === 'Light'
        ) || collection.modes[0];

      if (!primaryMode) return;

      const primaryModeName = primaryMode.name;
      
      // Resolve the value (handles both direct values and aliases)
      const value = resolveValue(variable, primaryModeName, data);

      // Skip if no value
      if (value === undefined || value === null) {
        return;
      }

      // Skip non-RN-safe values
      if (!isRNSafe(value, varName)) {
        return;
      }

      // Parse variable name into nested structure with camelCase
      const tokenPath = parseTokenName(varName).map(toCamelCaseRN);
      setNestedValue(tokens[camelCategory], tokenPath, value);
    });
  });

  // Convert to JavaScript object literal
  let js = '// React Native Design Tokens\n';
  js += '// Flattened from Figma variables\n';
  js += `// Exported at: ${data.metadata.exportedAt}\n\n`;
  js += `export const tokens = ${JSON.stringify(tokens, null, 2)};\n\n`;
  js += '// Usage:\n';
  js += "// import { tokens } from './tokens';\n";
  js +=
    '// <View style={{ backgroundColor: tokens.colors.primary, padding: tokens.spacing.md }} />\n';

  return js;
}

/**
 * Convert to Tailwind CSS config with nested structure
 * Generates proper Tailwind-native nested objects instead of flat strings
 */
function convertToTailwind(data: ExportData): string {
  // Helper: Parse token name into path array (e.g., "primary-500" -> ["primary", "500"])
  function parseTokenPath(name: string): string[] {
    // Split by common separators: /, -, _
    let parts: string[] = [];
    if (name.includes('/')) {
      parts = name.split('/');
    } else if (name.includes('-')) {
      parts = name.split('-');
    } else if (name.includes('_')) {
      parts = name.split('_');
    } else {
      parts = [name];
    }
    return parts.map(p => p.trim()).filter(p => p.length > 0);
  }

  // Helper: Set nested value in object
  function setNestedValueTailwind(obj: any, path: string[], value: any): void {
    if (path.length === 0) return;
    
    const key = path[0];
    if (!key) return;
    
    if (path.length === 1) {
      obj[key] = value;
      return;
    }
    
    if (!obj[key]) {
      obj[key] = {};
    }
    
    setNestedValueTailwind(obj[key], path.slice(1), value);
  }

  // Helper: Convert nested object to formatted string with proper indentation
  function stringifyNested(obj: any, indent: number = 6): string {
    const spaces = ' '.repeat(indent);
    const lines: string[] = [];
    
    for (const key in obj) {
      const value = obj[key];
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lines.push(`${spaces}${safeKey}: {`);
        lines.push(stringifyNested(value, indent + 2));
        lines.push(`${spaces}},`);
      } else {
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        lines.push(`${spaces}${safeKey}: ${formattedValue},`);
      }
    }
    
    return lines.join('\n');
  }

  // Build nested token structures
  const colorTokens: Record<string, any> = {};
  const spacingTokens: Record<string, any> = {};
  const fontSizeTokens: Record<string, any> = {};
  const borderRadiusTokens: Record<string, any> = {};
  const fontWeightTokens: Record<string, any> = {};
  const lineHeightTokens: Record<string, any> = {};
  const letterSpacingTokens: Record<string, any> = {};
  const fontFamilyTokens: Record<string, any> = {};

  Object.entries(data.collections).forEach(([collectionName, collection]) => {
    const collectionLower = collectionName.toLowerCase();

    Object.entries(collection.variables).forEach(([varName, variable]) => {
      // Get the primary mode (Default or first available)
      const primaryMode = collection.modes.find(
        m => m.name === 'Default' || m.name === 'Light'
      ) || collection.modes[0];
      
      if (!primaryMode) return;

      const primaryModeName = primaryMode.name;
      
      // Get value - check direct values first, then aliases
      let value: any;
      if (variable.values[primaryModeName] !== undefined) {
        value = variable.values[primaryModeName];
      } else if (variable.aliases[primaryModeName]) {
        // For aliases, use the alias name as a string reference
        value = variable.aliases[primaryModeName].name;
      }

      // Skip if no value
      if (value === undefined || value === null) return;

      // Parse the variable name into a path for nesting
      const tokenPath = parseTokenPath(varName);

      // Determine which Tailwind category this belongs to
      if (variable.type === 'COLOR') {
        setNestedValueTailwind(colorTokens, tokenPath, value);
      } else if (variable.type === 'FLOAT') {
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        if (!isNaN(numValue)) {
          const varLower = varName.toLowerCase();
          
          // Skip breakpoints entirely - they don't belong in Tailwind config theme
          if (varLower.includes('breakpoint') || collectionLower.includes('breakpoint')) {
            return;
          }
          
          // Border radius
          if (varLower.includes('radius') || collectionLower.includes('radius')) {
            setNestedValueTailwind(borderRadiusTokens, tokenPath, `${numValue}px`);
          } 
          // Font weight (but exclude border weights)
          else if ((varLower.includes('weight') || collectionLower.includes('weight')) && 
                   !varLower.includes('border') && !varLower.includes('stroke')) {
            setNestedValueTailwind(fontWeightTokens, tokenPath, numValue);
          } 
          // Line height
          else if (varLower.includes('line-height') || varLower.includes('lineheight') || 
                   collectionLower.includes('line-height')) {
            setNestedValueTailwind(lineHeightTokens, tokenPath, numValue);
          } 
          // Letter spacing
          else if (varLower.includes('letter-spacing') || varLower.includes('letterspacing') || 
                   collectionLower.includes('letter-spacing')) {
            setNestedValueTailwind(letterSpacingTokens, tokenPath, `${numValue}px`);
          } 
          // Font size (but exclude if from spacing collection or contains spacing keywords)
          else if ((varLower.includes('font') && varLower.includes('size')) || 
                   varLower.includes('text-size') ||
                   (collectionLower.includes('typography') && varLower.includes('size'))) {
            setNestedValueTailwind(fontSizeTokens, tokenPath, `${numValue}px`);
          } 
          // Spacing (only if collection is spacing-related AND not border/stroke/weight related)
          else if (collectionLower.includes('spacing') && 
                   !varLower.includes('border') && 
                   !varLower.includes('stroke') && 
                   !varLower.includes('weight') &&
                   !varLower.includes('font') &&
                   !varLower.includes('breakpoint')) {
            setNestedValueTailwind(spacingTokens, tokenPath, `${numValue}px`);
          }
          // Specific spacing keywords in variable name
          else if ((varLower.includes('gap') || varLower.includes('margin') || 
                    varLower.includes('padding')) &&
                   !varLower.includes('border') && !varLower.includes('stroke')) {
            setNestedValueTailwind(spacingTokens, tokenPath, `${numValue}px`);
          }
          // Skip everything else - don't force into any category
        }
      } else if (variable.type === 'STRING') {
        const varLower = varName.toLowerCase();
        // Skip breakpoints
        if (varLower.includes('breakpoint') || collectionLower.includes('breakpoint')) {
          return;
        }
        if (varLower.includes('font') && (varLower.includes('family') || collectionLower.includes('font'))) {
          setNestedValueTailwind(fontFamilyTokens, tokenPath, value);
        }
      }
    });
  });

  // Build the config file
  let config = '// Design Tokens exported from Figma\n';
  config += `// Exported at: ${data.metadata.exportedAt}\n`;
  config += `// File: ${data.metadata.figmaFileKey || 'Unknown'}\n`;
  config += `// Collections: ${Object.keys(data.collections).join(', ')}\n\n`;

  config += 'module.exports = {\n';
  config += '  theme: {\n';
  config += '    extend: {\n';

  // Add each category with nested structure
  if (Object.keys(colorTokens).length > 0) {
    config += '      colors: {\n';
    config += stringifyNested(colorTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(spacingTokens).length > 0) {
    config += '      spacing: {\n';
    config += stringifyNested(spacingTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(fontSizeTokens).length > 0) {
    config += '      fontSize: {\n';
    config += stringifyNested(fontSizeTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(fontWeightTokens).length > 0) {
    config += '      fontWeight: {\n';
    config += stringifyNested(fontWeightTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(lineHeightTokens).length > 0) {
    config += '      lineHeight: {\n';
    config += stringifyNested(lineHeightTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(letterSpacingTokens).length > 0) {
    config += '      letterSpacing: {\n';
    config += stringifyNested(letterSpacingTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(fontFamilyTokens).length > 0) {
    config += '      fontFamily: {\n';
    config += stringifyNested(fontFamilyTokens, 8);
    config += '\n      },\n';
  }

  if (Object.keys(borderRadiusTokens).length > 0) {
    config += '      borderRadius: {\n';
    config += stringifyNested(borderRadiusTokens, 8);
    config += '\n      },\n';
  }

  config += '    },\n';
  config += '  },\n';
  config += '  plugins: [],\n';
  config += '}\n\n';

  // Add usage examples with nested token names
  config += '// Usage Examples:\n';
  config += '// Nested tokens like "primary-500" become: bg-primary-500\n';
  config += '// Nested tokens like "text/heading/large" become: text-heading-large\n';
  config += '//\n';
  config += '// <div className="bg-primary-500 text-white p-md">\n';
  config += '//   <h1 className="text-heading-xl font-bold">Hello World</h1>\n';
  config += '// </div>\n';

  return config;
}

/**
 * Handle download button click
 */
function handleDownload(): void {
  if (!exportedData) return;

  const format = getSelectedFormat();
  const dateStr = new Date().toISOString().split('T')[0];

  try {
    if (format === 'json') {
      const content = JSON.stringify(exportedData, null, 2);
      downloadFile(
        content,
        'application/json',
        `design-tokens-${dateStr}.json`
      );
      showStatus('success', 'JSON file downloaded successfully!');
    } else if (format === 'css') {
      const content = convertToCSS(exportedData);
      downloadFile(content, 'text/css', `design-tokens-${dateStr}.css`);
      showStatus('success', 'CSS file downloaded successfully!');
    } else if (format === 'developer') {
      const content = JSON.stringify(
        convertToDeveloperFormat(exportedData),
        null,
        2
      );
      downloadFile(
        content,
        'application/json',
        `design-tokens-developer-${dateStr}.json`
      );
      showStatus('success', 'Developer JSON file downloaded successfully!');
    } else if (format === 'react-native') {
      const content = convertToReactNative(exportedData);
      downloadFile(content, 'application/javascript', `tokens-${dateStr}.js`);
      showStatus('success', 'React Native JS file downloaded successfully!');
    } else if (format === 'tailwind') {
      const content = convertToTailwind(exportedData);
      downloadFile(content, 'application/javascript', `tailwind.config-${dateStr}.js`);
      showStatus('success', 'Tailwind config downloaded successfully!');
    }
  } catch (error) {
    console.error('Download error:', error);
    showStatus('error', 'Failed to download file');
  }
}

/**
 * Download file helper
 */
function downloadFile(
  content: string,
  mimeType: string,
  filename: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Update download button text based on selected format
 */
function updateDownloadButtonText(): void {
  if (!downloadBtn || !copyBtn) return;

  const format = getSelectedFormat();

  switch (format) {
    case 'json':
      downloadBtn.textContent = 'Download JSON';
      copyBtn.textContent = 'Copy JSON';
      break;
    case 'css':
      downloadBtn.textContent = 'Download CSS';
      copyBtn.textContent = 'Copy CSS';
      break;
    case 'developer':
      downloadBtn.textContent = 'Download Developer JSON';
      copyBtn.textContent = 'Copy Developer JSON';
      break;
    case 'react-native':
      downloadBtn.textContent = 'Download React Native';
      copyBtn.textContent = 'Copy React Native';
      break;
    case 'tailwind':
      downloadBtn.textContent = 'Download Tailwind';
      copyBtn.textContent = 'Copy Tailwind';
      break;
    default:
      downloadBtn.textContent = 'Download';
      copyBtn.textContent = 'Copy to Clipboard';
  }
}

/**
 * Handle copy to clipboard
 */
async function handleCopy(): Promise<void> {
  if (!exportedData) return;

  try {
    const format = getSelectedFormat();
    let content: string;
    let message: string;

    if (format === 'json') {
      content = JSON.stringify(exportedData, null, 2);
      message = 'JSON copied to clipboard!';
    } else if (format === 'css') {
      content = convertToCSS(exportedData);
      message = 'CSS copied to clipboard!';
    } else if (format === 'developer') {
      content = JSON.stringify(convertToDeveloperFormat(exportedData), null, 2);
      message = 'Developer JSON copied to clipboard!';
    } else if (format === 'react-native') {
      content = convertToReactNative(exportedData);
      message = 'React Native JS copied to clipboard!';
    } else if (format === 'tailwind') {
      content = convertToTailwind(exportedData);
      message = 'Tailwind config copied to clipboard!';
    } else {
      throw new Error('Unknown format');
    }

    await navigator.clipboard.writeText(content);
    showStatus('success', message);
  } catch (error) {
    console.error('Copy error:', error);
    showStatus('error', 'Failed to copy to clipboard');
  }
}

/**
 * Handle close button click
 */
function handleClose(): void {
  console.log('Closing plugin...');
  const message: UIMessage = { type: 'close-plugin' };
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Show status message with floating notification at the bottom
 */
function showStatus(
  type: 'success' | 'error' | 'loading',
  message: string
): void {
  if (!status) return;

  // Clear any existing hide timeout
  const existingTimeout = (status as any)._hideTimeout;
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Remove hiding class and show notification
  status.classList.remove('hiding');
  status.className = `status ${type}`;
  status.textContent = message;
  status.style.display = 'block';

  // Auto-hide all notification types after a delay
  // Success and loading messages disappear after 3s
  // Error messages stay longer (5s) so users can read them
  const hideDelay = type === 'error' ? 5000 : 3000;

  // Don't auto-hide loading messages - they should be manually dismissed
  if (type !== 'loading') {
    const hideTimeout = setTimeout(() => {
      hideNotification();
    }, hideDelay);

    // Store timeout reference so we can clear it if needed
    (status as any)._hideTimeout = hideTimeout;
  }
}

/**
 * Hide notification with smooth animation
 */
function hideNotification(): void {
  if (!status) return;

  // Add hiding class for fade-out animation
  status.classList.add('hiding');

  // Actually hide after animation completes
  setTimeout(() => {
    status.style.display = 'none';
    status.classList.remove('hiding');
  }, 300); // Match the CSS transition duration
}

/**
 * Show preview of exported data
 */
function showPreview(data: ExportData): void {
  exportedData = data;
  updatePreviewContent();

  if (previewSection) {
    previewSection.style.display = 'block';
  }
}

/**
 * Update preview content based on selected format
 */
function updatePreviewContent(): void {
  if (!exportedData || !previewContent) return;

  const format = getSelectedFormat();

  if (format === 'css') {
    const cssContent = convertToCSS(exportedData);
    previewContent.textContent = cssContent;
    if (previewTitle) previewTitle.textContent = 'CSS Preview';
  } else if (format === 'developer') {
    const developerContent = convertToDeveloperFormat(exportedData);
    previewContent.textContent = JSON.stringify(developerContent, null, 2);
    if (previewTitle)
      previewTitle.textContent = 'Developer JSON Preview (W3C Format)';
  } else if (format === 'react-native') {
    const reactNativeContent = convertToReactNative(exportedData);
    previewContent.textContent = reactNativeContent;
    if (previewTitle) previewTitle.textContent = 'React Native Preview';
  } else if (format === 'tailwind') {
    const tailwindContent = convertToTailwind(exportedData);
    previewContent.textContent = tailwindContent;
    if (previewTitle) previewTitle.textContent = 'Tailwind Config Preview';
  } else {
    const preview = createJSONPreview(exportedData);
    previewContent.textContent = JSON.stringify(preview, null, 2);
    if (previewTitle) previewTitle.textContent = 'JSON Preview';
  }
}

/**
 * Create a condensed JSON preview
 */
function createJSONPreview(data: ExportData): any {
  return {
    metadata: data.metadata,
    collections: Object.fromEntries(
      Object.entries(data.collections).map(([collectionName, collection]) => {
        const variableNames = Object.keys(collection.variables);
        const previewVariables = Object.fromEntries(
          variableNames
            .slice(0, 3)
            .map(name => [name, collection.variables[name]])
        );

        if (variableNames.length > 3) {
          (previewVariables as any)['...'] =
            `and ${variableNames.length - 3} more variables`;
        }

        return [
          collectionName,
          {
            name: collection.name,
            modes: collection.modes,
            variableCount: variableNames.length,
            variables: previewVariables,
          },
        ];
      })
    ),
  };
}

// Initialize when DOM is ready
console.log('Document ready state:', document.readyState);

if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded via event, initializing plugin UI...');
    initializePlugin();
  });
} else {
  console.log('DOM already loaded, initializing immediately...');
  initializePlugin();
}
