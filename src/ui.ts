// UI logic for the Design Token Export plugin
import { ExportData, ExportFormat, UIMessage, PluginMessage } from './types';

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

  // Add event listeners for format radio buttons
  const formatRadios = document.querySelectorAll('input[name="exportFormat"]');
  formatRadios.forEach(element => {
    const radio = element as HTMLInputElement;
    radio.addEventListener('change', () => {
      console.log('Export format changed to:', radio.value);
      updateDownloadButtonText();
      if (exportedData) {
        updatePreviewContent();
      }
    });
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
  const formatRadios = document.querySelectorAll('input[name="exportFormat"]');

  for (let i = 0; i < formatRadios.length; i++) {
    const radio = formatRadios[i] as HTMLInputElement;
    if (radio.checked) {
      return radio.value as ExportFormat;
    }
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
 * Show status message
 */
function showStatus(
  type: 'success' | 'error' | 'loading',
  message: string
): void {
  if (!status) return;

  status.className = `status ${type}`;
  status.textContent = message;
  status.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
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
