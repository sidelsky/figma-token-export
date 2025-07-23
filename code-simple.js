// Simple test version of the plugin code
console.log('Design Token Export plugin loaded');

// Show UI when plugin is launched
figma.showUI(__html__, { width: 400, height: 600 });

// Simple message handler
figma.ui.onmessage = async (msg) => {
  console.log('Plugin received message:', msg);
  
  if (msg.type === 'export-tokens') {
    try {
      console.log('Starting token extraction...');
      
      // Get variable collections
      const collections = figma.variables.getLocalVariableCollections();
      console.log(`Found ${collections.length} collections`);
      
      // Simple response
      figma.ui.postMessage({
        type: 'tokens-extracted',
        data: {
          metadata: {
            exportedAt: new Date().toISOString(),
            figmaFileKey: figma.fileKey,
            collections: collections.length
          },
          collections: {}
        }
      });
    } catch (error) {
      console.error('Error:', error);
      figma.ui.postMessage({
        type: 'error',
        message: error.message
      });
    }
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
}; 