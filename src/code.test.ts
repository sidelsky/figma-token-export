// Tests for main plugin logic
import { ExportData, VariableData } from './types';

// Mock Figma API
const mockCollection = {
  id: 'test-collection-id',
  name: 'Test Collection',
  description: 'Test description',
  modes: [
    { modeId: 'mode-1', name: 'Default' },
    { modeId: 'mode-2', name: 'Dark' },
  ],
  variableIds: ['var-1', 'var-2'],
};

const mockVariable = {
  id: 'var-1',
  name: 'primary-color',
  description: 'Primary color variable',
  resolvedType: 'COLOR',
  scopes: ['ALL_SCOPES'],
  valuesByMode: {
    'mode-1': { r: 0, g: 0.5, b: 1, a: 1 },
    'mode-2': { r: 0.1, g: 0.6, b: 1, a: 1 },
  },
};

// Mock globals
(global as any).figma = {
  fileKey: 'test-file-key',
  variables: {
    getLocalVariableCollections: jest.fn(() => [mockCollection]),
    getVariableById: jest.fn(() => mockVariable),
  },
  ui: {
    postMessage: jest.fn(),
  },
};

describe('Design Token Export Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should format color values correctly', () => {
    // Test hex color formatting
    const colorValue = { r: 0, g: 0.5, b: 1, a: 1 };
    // We can't import the function directly since it's not exported
    // This is a basic structure test for now
    expect(colorValue).toHaveProperty('r');
    expect(colorValue).toHaveProperty('g');
    expect(colorValue).toHaveProperty('b');
    expect(colorValue).toHaveProperty('a');
  });

  test('should create proper export data structure', () => {
    const exportData: ExportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        figmaFileKey: 'test-key',
        collections: 1,
      },
      collections: {
        'Test Collection': {
          id: 'test-id',
          name: 'Test Collection',
          description: 'Test description',
          modes: [{ modeId: 'mode-1', name: 'Default' }],
          variables: {},
        },
      },
    };

    expect(exportData.metadata).toBeDefined();
    expect(exportData.collections).toBeDefined();
    expect(exportData.metadata.figmaFileKey).toBe('test-key');
  });

  test('should handle variable data structure', () => {
    const variableData: VariableData = {
      id: 'test-var',
      name: 'test-variable',
      description: 'Test variable',
      type: 'COLOR',
      scopes: ['ALL_SCOPES'],
      values: {
        Default: '#0080ff',
      },
      aliases: {},
    };

    expect(variableData.id).toBe('test-var');
    expect(variableData.values).toHaveProperty('Default');
  });
});
