// Main plugin logic for extracting and exporting Figma variables
/// <reference types="@figma/plugin-typings" />

import {
  ExportData,
  CollectionData,
  VariableData,
  ColorValue,
  UIMessage,
  PluginMessage,
} from './types';

console.log('Design Token Export plugin loaded');

// Show UI when plugin is launched - resizable window
figma.showUI(__html__, { 
  width: 480, 
  height: 500,
  themeColors: true,
  title: 'Design Token Export'
});

// Handle messages from the UI
figma.ui.onmessage = async (msg: UIMessage): Promise<void> => {
  console.log('Plugin received message:', msg);

  try {
    switch (msg.type) {
      case 'export-tokens': {
        console.log('Starting token extraction...');
        const tokens = await extractAllTokens();
        console.log('Tokens extracted successfully:', tokens);

        const successMessage: PluginMessage = {
          type: 'tokens-extracted',
          data: tokens,
        };
        figma.ui.postMessage(successMessage);
        break;
      }

      case 'close-plugin':
        figma.closePlugin();
        break;

      default:
        console.warn('Unknown message type:', msg);
    }
  } catch (error) {
    console.error('Error processing message:', error);

    const errorMessage: PluginMessage = {
      type: 'error',
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
    figma.ui.postMessage(errorMessage);
  }
};

/**
 * Extract all design tokens from the current Figma file
 */
async function extractAllTokens(): Promise<ExportData> {
  console.log('Getting variable collections...');

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  console.log(
    `Found ${collections.length} collections:`,
    collections.map((c: any) => c.name)
  );

  if (collections.length === 0) {
    throw new Error(
      'No variable collections found in this file. Please create some variables first.'
    );
  }

  const exportData: ExportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      figmaFileKey: figma.fileKey || null,
      collections: collections.length,
    },
    collections: {},
  };

  for (const collection of collections) {
    try {
      const collectionData = await processCollection(collection);
      exportData.collections[collection.name] = collectionData;
    } catch (error) {
      console.error(`Error processing collection "${collection.name}":`, error);
      // Continue with other collections instead of failing completely
    }
  }

  if (Object.keys(exportData.collections).length === 0) {
    throw new Error('Failed to process any variable collections.');
  }

  return exportData;
}

/**
 * Process a single variable collection
 */
async function processCollection(collection: any): Promise<CollectionData> {
  const collectionData: CollectionData = {
    id: collection.id,
    name: collection.name,
    description: collection.description || '',
    modes: collection.modes.map((mode: any) => ({
      modeId: mode.modeId,
      name: mode.name,
    })),
    variables: {},
  };

  // Get all variables in this collection
  const variables = (
    await Promise.all(
      collection.variableIds.map((id: string) =>
        figma.variables.getVariableByIdAsync(id)
      )
    )
  ).filter((variable: any): variable is any => variable !== null);

  console.log(
    `Processing ${variables.length} variables in collection "${collection.name}"`
  );

  for (const variable of variables) {
    try {
      const variableData = await processVariable(variable, collection);
      collectionData.variables[variable.name] = variableData;
    } catch (error) {
      console.error(`Error processing variable "${variable.name}":`, error);
      // Continue with other variables
    }
  }

  return collectionData;
}

/**
 * Process a single variable
 */
async function processVariable(
  variable: any,
  collection: any
): Promise<VariableData> {
  const variableData: VariableData = {
    id: variable.id,
    name: variable.name,
    description: variable.description || '',
    type: variable.resolvedType,
    scopes: variable.scopes,
    values: {},
    aliases: {},
  };

  // Process values for each mode
  for (const mode of collection.modes) {
    const value = variable.valuesByMode[mode.modeId];

    if (value !== undefined) {
      if (
        typeof value === 'object' &&
        value !== null &&
        'type' in value &&
        value.type === 'VARIABLE_ALIAS'
      ) {
        // Handle variable aliases
        const aliasedVariable = await figma.variables.getVariableByIdAsync(
          value.id
        );
        variableData.aliases[mode.name] = {
          id: value.id,
          name: aliasedVariable ? aliasedVariable.name : 'Unknown',
        };
      } else {
        // Handle direct values
        variableData.values[mode.name] = formatValue(
          value,
          variable.resolvedType
        );
      }
    }
  }

  return variableData;
}

/**
 * Format a variable value based on its type
 */
function formatValue(value: any, type: string): any {
  try {
    switch (type) {
      case 'COLOR':
        return formatColorValue(value);

      case 'FLOAT':
        return typeof value === 'number' ? value : parseFloat(String(value));

      case 'STRING':
        return String(value);

      case 'BOOLEAN':
        return Boolean(value);

      default:
        return value;
    }
  } catch (error) {
    console.warn(`Error formatting value ${value} of type ${type}:`, error);
    return value;
  }
}

/**
 * Format color values to hex or rgba strings
 */
function formatColorValue(value: any): string {
  if (typeof value === 'object' && value !== null && 'r' in value) {
    const colorValue = value as ColorValue;

    // Convert RGB values (0-1) to 0-255 range
    const r = Math.round(Math.max(0, Math.min(1, colorValue.r)) * 255);
    const g = Math.round(Math.max(0, Math.min(1, colorValue.g)) * 255);
    const b = Math.round(Math.max(0, Math.min(1, colorValue.b)) * 255);
    const a =
      colorValue.a !== undefined ? Math.max(0, Math.min(1, colorValue.a)) : 1;

    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }

  return String(value);
}
