// UI logic for the Design Token Export plugin
console.log('ui.js script starting to execute...');

let exportedData = null;
let exportBtn, downloadBtn, copyBtn, closeBtn, status, previewSection, previewContent;

// Initialize immediately or wait for DOM
console.log('Document ready state:', document.readyState);

if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing plugin UI...');
    initializePlugin();
  });
} else {
  console.log('DOM already loaded, initializing immediately...');
  initializePlugin();
}

// Initialize plugin after DOM is ready
function initializePlugin() {
  // DOM elements
  exportBtn = document.getElementById('exportBtn');
  downloadBtn = document.getElementById('downloadBtn');
  copyBtn = document.getElementById('copyBtn');
  closeBtn = document.getElementById('closeBtn');
  status = document.getElementById('status');
  previewSection = document.getElementById('previewSection');
  previewContent = document.getElementById('previewContent');

  // Check if elements exist
  if (!exportBtn) {
    console.error('Export button not found! Available elements with IDs:');
    const elementsWithIds = document.querySelectorAll('[id]');
    elementsWithIds.forEach(el => console.log('- Found element:', el.id, el.tagName));
    return;
  }

  console.log('All DOM elements found, setting up event listeners...');
  console.log('Export button:', exportBtn);
  console.log('Export button type:', exportBtn.tagName, 'ID:', exportBtn.id);

  // Event listeners
  exportBtn.addEventListener('click', function() {
    console.log('Export button clicked!');
    handleExport();
  });
  downloadBtn.addEventListener('click', handleDownload);
  copyBtn.addEventListener('click', handleCopy);
  closeBtn.addEventListener('click', handleClose);

  // Listen for messages from plugin code
  window.onmessage = (event) => {
    console.log('Received message:', event.data);
    if (!event.data.pluginMessage) return;
    
    const { type, data, message } = event.data.pluginMessage;
    
    switch (type) {
      case 'tokens-extracted':
        exportBtn.disabled = false;
        exportBtn.textContent = 'Export Design Tokens';
        showStatus('success', `Successfully extracted ${Object.keys(data.collections).length} collection(s)!`);
        showPreview(data);
        break;
        
      case 'error':
        exportBtn.disabled = false;
        exportBtn.textContent = 'Export Design Tokens';
        showStatus('error', `Error: ${message}`);
        break;
    }
  };
}

// Handle export button click
function handleExport() {
  console.log('Starting export process...');
  showStatus('loading', 'Extracting design tokens...');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';
  
  // Send message to plugin code to start extraction
  console.log('Sending message to plugin code...');
  parent.postMessage({ pluginMessage: { type: 'export-tokens' } }, '*');
}

// Handle download button click
function handleDownload() {
  if (!exportedData) return;
  
  const jsonString = JSON.stringify(exportedData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `design-tokens-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  showStatus('success', 'JSON file downloaded successfully!');
}

// Handle copy to clipboard
async function handleCopy() {
  if (!exportedData) return;
  
  try {
    const jsonString = JSON.stringify(exportedData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    showStatus('success', 'JSON copied to clipboard!');
  } catch (err) {
    showStatus('error', 'Failed to copy to clipboard');
  }
}

// Handle close button click
function handleClose() {
  parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
}

// Show status message
function showStatus(type, message) {
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

// Show preview of exported data
function showPreview(data) {
  exportedData = data;
  
  // Create a preview of the data structure
  const preview = {
    metadata: data.metadata,
    collections: Object.keys(data.collections).reduce((acc, collectionName) => {
      const collection = data.collections[collectionName];
      acc[collectionName] = {
        name: collection.name,
        modes: collection.modes,
        variableCount: Object.keys(collection.variables).length,
        variables: Object.keys(collection.variables).slice(0, 3).reduce((vars, varName) => {
          vars[varName] = collection.variables[varName];
          return vars;
        }, {})
      };
      
      if (Object.keys(collection.variables).length > 3) {
        acc[collectionName].variables['...'] = `and ${Object.keys(collection.variables).length - 3} more variables`;
      }
      
      return acc;
    }, {})
  };
  
  if (previewContent) {
    previewContent.textContent = JSON.stringify(preview, null, 2);
    previewSection.style.display = 'block';
  }
} 