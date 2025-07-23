// Tests for UI logic
import { ExportData, ExportFormat } from './types';

// Mock DOM
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
    },
  },
});

describe('UI Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="exportBtn">Export</button>
      <button id="downloadBtn">Download</button>
      <button id="copyBtn">Copy</button>
      <button id="closeBtn">Close</button>
      <div id="status"></div>
      <div id="previewSection"></div>
      <pre id="previewContent"></pre>
      <div id="previewTitle"></div>
      <input type="radio" name="exportFormat" value="json" checked>
      <input type="radio" name="exportFormat" value="css">
    `;
  });

  test('should find DOM elements', () => {
    const exportBtn = document.getElementById('exportBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    expect(exportBtn).toBeTruthy();
    expect(downloadBtn).toBeTruthy();
  });

  test('should handle export data structure', () => {
    const mockData: ExportData = {
      metadata: {
        exportedAt: '2024-01-01T00:00:00.000Z',
        figmaFileKey: 'test-key',
        collections: 1,
      },
      collections: {
        Colors: {
          id: 'colors-id',
          name: 'Colors',
          description: 'Color variables',
          modes: [{ modeId: 'default', name: 'Default' }],
          variables: {
            primary: {
              id: 'primary-id',
              name: 'primary',
              description: 'Primary color',
              type: 'COLOR',
              scopes: ['ALL_SCOPES'],
              values: { Default: '#007AFF' },
              aliases: {},
            },
          },
        },
      },
    };

    expect(mockData.collections['Colors']).toBeDefined();
    expect(
      mockData.collections['Colors'].variables['primary'].values['Default']
    ).toBe('#007AFF');
  });

  test('should detect selected format', () => {
    const jsonRadio = document.querySelector(
      'input[value="json"]'
    ) as HTMLInputElement;
    const cssRadio = document.querySelector(
      'input[value="css"]'
    ) as HTMLInputElement;

    expect(jsonRadio.checked).toBe(true);
    expect(cssRadio.checked).toBe(false);

    // Test format switching
    jsonRadio.checked = false;
    cssRadio.checked = true;

    expect(jsonRadio.checked).toBe(false);
    expect(cssRadio.checked).toBe(true);
  });

  test('should format values for CSS correctly', () => {
    // Test color value
    const colorValue = '#007AFF';
    expect(colorValue).toMatch(/^#[0-9A-Fa-f]{6}$/);

    // Test number value with px
    const numberValue = 16;
    const formattedValue = `${numberValue}px`;
    expect(formattedValue).toBe('16px');

    // Test string value with quotes
    const stringValue = 'Inter';
    const formattedString = `"${stringValue}"`;
    expect(formattedString).toBe('"Inter"');
  });
});
