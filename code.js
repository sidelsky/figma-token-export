// Main plugin logic for extracting and exporting Figma variables

// Handle menu commands
if (figma.command === 'exportTokens') {
  figma.showUI(__html__, { width: 400, height: 600 });
} else {
  figma.showUI(__html__, { width: 400, height: 600 });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-tokens') {
    try {
      const tokens = await extractAllTokens();
      figma.ui.postMessage({
        type: 'tokens-extracted',
        data: tokens
      });
    } catch (error) {
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

async function extractAllTokens() {
  const collections = figma.variables.getLocalVariableCollections();
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      figmaFileKey: figma.fileKey,
      collections: collections.length
    },
    collections: {}
  };

  for (const collection of collections) {
    const collectionData = {
      id: collection.id,
      name: collection.name,
      description: collection.description || '',
      modes: collection.modes.map(mode => ({
        modeId: mode.modeId,
        name: mode.name
      })),
      variables: {}
    };

    // Get all variables in this collection
    const variables = collection.variableIds.map(id => figma.variables.getVariableById(id));
    
    for (const variable of variables) {
      if (!variable) continue;
      
      const variableData = {
        id: variable.id,
        name: variable.name,
        description: variable.description || '',
        type: variable.resolvedType,
        scopes: variable.scopes,
        values: {},
        aliases: {}
      };

      // Process values for each mode
      for (const mode of collection.modes) {
        const value = variable.valuesByMode[mode.modeId];
        
        if (value !== undefined) {
          if (typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
            // Handle variable aliases
            const aliasedVariable = figma.variables.getVariableById(value.id);
            variableData.aliases[mode.name] = {
              id: value.id,
              name: aliasedVariable ? aliasedVariable.name : 'Unknown'
            };
          } else {
            // Handle direct values
            variableData.values[mode.name] = formatValue(value, variable.resolvedType);
          }
        }
      }

      collectionData.variables[variable.name] = variableData;
    }

    exportData.collections[collection.name] = collectionData;
  }

  return exportData;
}

function formatValue(value, type) {
  switch (type) {
    case 'COLOR':
      if (typeof value === 'object' && 'r' in value) {
        // Convert RGB values (0-1) to hex
        const r = Math.round(value.r * 255);
        const g = Math.round(value.g * 255);
        const b = Math.round(value.b * 255);
        const a = value.a !== undefined ? value.a : 1;
        
        if (a < 1) {
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      }
      return value;
      
    case 'FLOAT':
      return typeof value === 'number' ? value : parseFloat(value);
      
    case 'STRING':
      return String(value);
      
    case 'BOOLEAN':
      return Boolean(value);
      
    default:
      return value;
  }
}

// Initialize plugin
console.log('Design Token Export plugin loaded'); 