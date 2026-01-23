// UI logic for the Design Token Export plugin
import {
  ExportData,
  ExportFormat,
  UIMessage,
  PluginMessage,
  DeveloperExportData,
  GitHubSettings,
} from './types';
import { pushToGitHub, parseRepoUrl } from './github';

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

// GitHub DOM elements
let githubSection: HTMLDivElement;
let githubToggle: HTMLDivElement;
let githubSettings: HTMLDivElement;
let githubToggleIcon: HTMLSpanElement;
let githubRepoInput: HTMLInputElement;
let githubBranchInput: HTMLInputElement;
let githubFilePathInput: HTMLInputElement;
let githubTokenInput: HTMLInputElement;
let githubCommitMessageInput: HTMLInputElement;
let saveGithubSettingsBtn: HTMLButtonElement;
let pushToGithubBtn: HTMLButtonElement;
let githubStatus: HTMLDivElement;

// GitHub state
let githubSettingsCollapsed = false;

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

  // Get GitHub DOM elements
  githubSection = getElementById('githubSection') as HTMLDivElement;
  githubToggle = getElementById('githubToggle') as HTMLDivElement;
  githubSettings = getElementById('githubSettings') as HTMLDivElement;
  githubToggleIcon = getElementById('githubToggleIcon') as HTMLSpanElement;
  githubRepoInput = getElementById('githubRepo') as HTMLInputElement;
  githubBranchInput = getElementById('githubBranch') as HTMLInputElement;
  githubFilePathInput = getElementById('githubFilePath') as HTMLInputElement;
  githubTokenInput = getElementById('githubToken') as HTMLInputElement;
  githubCommitMessageInput = getElementById('githubCommitMessage') as HTMLInputElement;
  saveGithubSettingsBtn = getElementById('saveGithubSettings') as HTMLButtonElement;
  pushToGithubBtn = getElementById('pushToGithub') as HTMLButtonElement;
  githubStatus = getElementById('githubStatus') as HTMLDivElement;

  console.log('All DOM elements found, setting up event listeners...');

  // Event listeners
  exportBtn.addEventListener('click', handleExport);
  downloadBtn.addEventListener('click', handleDownload);
  copyBtn.addEventListener('click', handleCopy);
  closeBtn.addEventListener('click', handleClose);

  // GitHub event listeners
  githubToggle.addEventListener('click', toggleGithubSettings);
  saveGithubSettingsBtn.addEventListener('click', saveGithubSettings);
  pushToGithubBtn.addEventListener('click', handlePushToGithub);

  // Load saved GitHub settings
  loadGithubSettings();

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
          handleTokensExtractedWithGithub(data);
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
  if (name.includes('color') || name.includes('colour')) return 'colors';
  if (name.includes('spacing') || name.includes('space')) return 'spacing';
  if (
    name.includes('typography') ||
    name.includes('font') ||
    name.includes('text')
  )
    return 'typography';
  if (name.includes('radius') || name.includes('border')) return 'borderRadius';
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
    parts = name.split(/(?=[A-Z])/).map(p => p.toLowerCase());

    // If no camelCase detected, use the whole name
    if (parts.length === 1) {
      parts = [name];
    }
  }

  // Clean up parts
  return parts.map(p => p.trim().toLowerCase()).filter(p => p.length > 0);
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
  } else if (format === 'developer') {
    const developerContent = convertToDeveloperFormat(exportedData);
    previewContent.textContent = JSON.stringify(developerContent, null, 2);
    if (previewTitle)
      previewTitle.textContent = 'Developer JSON Preview (W3C Format)';
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

/**
 * Toggle GitHub settings panel
 */
function toggleGithubSettings(): void {
  githubSettingsCollapsed = !githubSettingsCollapsed;

  if (githubSettingsCollapsed) {
    githubSettings.style.display = 'none';
    githubToggleIcon.textContent = '▶';
  } else {
    githubSettings.style.display = 'block';
    githubToggleIcon.textContent = '▼';
  }
}

/**
 * Load GitHub settings from storage
 */
async function loadGithubSettings(): Promise<void> {
  const savedSettings = localStorage.getItem('githubSettings');
  if (savedSettings) {
    try {
      const settings: GitHubSettings = JSON.parse(savedSettings);
      githubRepoInput.value = settings.repoUrl || '';
      githubBranchInput.value = settings.branch || 'main';
      githubFilePathInput.value = settings.filePath || 'tokens/design-tokens.json';
      if (settings.token) {
        githubTokenInput.value = settings.token;
      }
    } catch (error) {
      console.error('Failed to load GitHub settings:', error);
    }
  }
}

/**
 * Save GitHub settings to storage
 */
async function saveGithubSettings(): Promise<void> {
  const repoUrl = githubRepoInput.value.trim();
  const branch = githubBranchInput.value.trim();
  const filePath = githubFilePathInput.value.trim();
  const token = githubTokenInput.value.trim();

  if (!repoUrl || !branch || !filePath) {
    showGithubStatus('error', 'Please fill in all required fields');
    return;
  }

  // Parse repository URL
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    showGithubStatus('error', 'Invalid repository URL format');
    return;
  }

  // Save to local storage
  const settings: GitHubSettings = {
    repoUrl,
    branch,
    filePath,
  };

  // Only add token if provided
  if (token) {
    settings.token = token;
  }

  try {
    localStorage.setItem('githubSettings', JSON.stringify(settings));
    showGithubStatus('success', 'Settings saved successfully!');

    // Enable push button if we have data
    if (exportedData) {
      pushToGithubBtn.disabled = false;
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    showGithubStatus('error', 'Failed to save settings');
  }
}

/**
 * Handle push to GitHub
 */
async function handlePushToGithub(): Promise<void> {
  if (!exportedData) {
    showGithubStatus('error', 'Please export tokens first');
    return;
  }

  const repoUrl = githubRepoInput.value.trim();
  const branch = githubBranchInput.value.trim();
  const filePath = githubFilePathInput.value.trim();
  const token = githubTokenInput.value.trim();
  const commitMessage = githubCommitMessageInput.value.trim();

  if (!repoUrl || !branch || !filePath || !token) {
    showGithubStatus('error', 'Please fill in all fields including token');
    return;
  }

  // Parse repository URL
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    showGithubStatus('error', 'Invalid repository URL format');
    return;
  }

  // Get the content based on selected format
  const format = getSelectedFormat();
  let content: string;

  try {
    if (format === 'json') {
      content = JSON.stringify(exportedData, null, 2);
    } else if (format === 'css') {
      content = convertToCSS(exportedData);
    } else if (format === 'developer') {
      content = JSON.stringify(convertToDeveloperFormat(exportedData), null, 2);
    } else {
      throw new Error('Unknown format');
    }
  } catch (error) {
    console.error('Failed to generate content:', error);
    showGithubStatus('error', 'Failed to generate export content');
    return;
  }

  // Show loading state
  showGithubStatus('loading', 'Pushing to GitHub...');
  pushToGithubBtn.disabled = true;
  pushToGithubBtn.textContent = 'Pushing...';

  try {
    const result = await pushToGitHub({
      config: {
        token,
        owner: parsed.owner,
        repo: parsed.repo,
        branch,
        filePath,
      },
      content,
      commitMessage: commitMessage || 'Update design tokens from Figma',
    });

    if (result.success) {
      showGithubStatus('success', result.message);
      if (result.commitUrl) {
        // Add link to commit
        githubStatus.innerHTML = `
          ✅ ${result.message} 
          <a href="${result.commitUrl}" target="_blank" style="color: #18a0fb; text-decoration: none;">
            View commit →
          </a>
        `;
      }
    } else {
      showGithubStatus('error', result.message);
    }
  } catch (error) {
    console.error('Push error:', error);
    showGithubStatus(
      'error',
      error instanceof Error ? error.message : 'Failed to push to GitHub'
    );
  } finally {
    pushToGithubBtn.disabled = false;
    pushToGithubBtn.textContent = '🚀 Push to GitHub';
  }
}

/**
 * Show GitHub status message
 */
function showGithubStatus(
  type: 'success' | 'error' | 'loading',
  message: string
): void {
  if (!githubStatus) return;

  githubStatus.className = `status ${type}`;
  githubStatus.textContent = message;
  githubStatus.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      githubStatus.style.display = 'none';
    }, 5000);
  }
}

/**
 * Update preview and show GitHub section when tokens are extracted
 */
function handleTokensExtractedWithGithub(data: ExportData): void {
  handleTokensExtracted(data);

  // Show GitHub section after successful export
  githubSection.style.display = 'block';

  // Load saved settings
  const savedSettings = localStorage.getItem('githubSettings');
  if (savedSettings) {
    try {
      const settings: GitHubSettings = JSON.parse(savedSettings);
      githubRepoInput.value = settings.repoUrl || '';
      githubBranchInput.value = settings.branch || 'main';
      githubFilePathInput.value = settings.filePath || 'tokens/design-tokens.json';
      if (settings.token) {
        githubTokenInput.value = settings.token;
      }

      // Enable push button if all fields are filled
      if (settings.repoUrl && settings.branch && settings.filePath) {
        pushToGithubBtn.disabled = false;
      }
    } catch (error) {
      console.error('Failed to parse saved settings:', error);
    }
  }
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
