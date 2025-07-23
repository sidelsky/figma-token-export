// UI logic for the Design Token Export plugin

let exportedData = null;

// DOM elements
const exportBtn = document.getElementById('exportBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const closeBtn = document.getElementById('closeBtn');
const status = document.getElementById('status');
const previewSection = document.getElementById('previewSection');
const previewContent = document.getElementById('previewContent');

// Event listeners
exportBtn.addEventListener('click', handleExport);
downloadBtn.addEventListener('click', handleDownload);
copyBtn.addEventListener('click', handleCopy);
closeBtn.addEventListener('click', handleClose);

// Handle export button click
function handleExport() {
  showStatus('loading', 'Extracting design tokens...');
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';
  
  // Send message to plugin code to start extraction
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
  
  previewContent.textContent = JSON.stringify(preview, null, 2);
  previewSection.style.display = 'block';
}

// Listen for messages from plugin code
window.onmessage = (event) => {
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