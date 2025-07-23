// Test setup file

// Mock Figma API for tests
const mockFigma = {
  showUI: jest.fn(),
  closePlugin: jest.fn(),
  ui: {
    onmessage: jest.fn(),
    postMessage: jest.fn(),
  },
  variables: {
    getLocalVariableCollections: jest.fn(),
    getVariableById: jest.fn(),
  },
  fileKey: 'test-file-key',
};

(global as any).figma = mockFigma;
(global as any).__html__ = '<div>Test HTML</div>';

// Mock parent for UI tests
(global as any).parent = {
  postMessage: jest.fn(),
}; 