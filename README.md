# Figma Design Token Export Plugin

A Figma plugin that exports your design variables and tokens into a developer-friendly JSON format for seamless design-to-development handoff.

## Features

- 🎨 **Complete Variable Export**: Exports all local variable collections from your Figma file
- 🏷️ **Multi-Mode Support**: Handles all modes within variable collections (light/dark themes, etc.)
- 🔗 **Alias Handling**: Properly exports variable aliases and references
- 🎯 **Type-Safe**: Maintains proper data types for colors, numbers, strings, and booleans
- 📄 **Developer-Ready**: Exports in a clean JSON structure that's easy to consume in code
- 💾 **Multiple Export Options**: Download JSON file or copy to clipboard
- 👀 **Live Preview**: See a preview of your exported data before downloading

## Supported Variable Types

- **Colors**: Exported as hex codes or rgba values (with alpha support)
- **Numbers**: Exported as float values for spacing, sizing, etc.
- **Strings**: Exported as string values for typography, content, etc.
- **Booleans**: Exported as boolean values for feature flags, etc.

## Installation

### Method 1: Install from Figma Community (Recommended)
1. Search for "Design Token Export" in the Figma Community
2. Click "Install" to add it to your plugins

### Method 2: Install from Code
1. Download or clone this repository
2. Open Figma Desktop App
3. Go to `Plugins` → `Development` → `Import plugin from manifest...`
4. Select the `manifest.json` file from this project
5. The plugin will be available in your Plugins menu

## Usage

1. **Open the Plugin**: In your Figma file, go to `Plugins` → `Design Token Export`
2. **Export Tokens**: Click the "Export Design Tokens" button
3. **Preview Results**: Review the exported structure in the preview panel
4. **Download or Copy**: Either download as a JSON file or copy to clipboard

## Exported JSON Structure

The plugin exports your design tokens in the following structure:

```json
{
  "metadata": {
    "exportedAt": "2024-01-15T10:30:00.000Z",
    "figmaFileKey": "your-file-key",
    "collections": 2
  },
  "collections": {
    "Colors": {
      "id": "collection-id",
      "name": "Colors",
      "description": "Color variables for the design system",
      "modes": [
        {
          "modeId": "mode-id-1",
          "name": "Light"
        },
        {
          "modeId": "mode-id-2", 
          "name": "Dark"
        }
      ],
      "variables": {
        "primary": {
          "id": "variable-id",
          "name": "primary",
          "description": "Primary brand color",
          "type": "COLOR",
          "scopes": ["ALL_SCOPES"],
          "values": {
            "Light": "#3b82f6",
            "Dark": "#60a5fa"
          },
          "aliases": {}
        }
      }
    }
  }
}
```

## Integration Examples

### CSS Custom Properties
```css
:root {
  --color-primary: #3b82f6;
  --spacing-lg: 24px;
  --font-size-xl: 20px;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
}
```

### JavaScript/TypeScript
```javascript
import tokens from './design-tokens.json';

// Access token values
const primaryColor = tokens.collections.Colors.variables.primary.values.Light;
const spacingLg = tokens.collections.Spacing.variables.lg.values.Default;
```

### Tailwind CSS
```javascript
// tailwind.config.js
const tokens = require('./design-tokens.json');

module.exports = {
  theme: {
    colors: {
      primary: tokens.collections.Colors.variables.primary.values.Light,
      // ... more colors
    },
    spacing: {
      lg: tokens.collections.Spacing.variables.lg.values.Default + 'px',
      // ... more spacing
    }
  }
}
```

## Development

### Prerequisites
- Figma Desktop App
- Basic knowledge of JavaScript and Figma Plugin API

### Setup
1. Clone this repository
2. Open Figma Desktop App
3. Import the plugin using the manifest.json file
4. Make changes to the code files
5. Reload the plugin in Figma to test changes

### File Structure
```
figma-token-export/
├── manifest.json    # Plugin configuration
├── code.js         # Main plugin logic (runs in Figma context)
├── ui.html         # Plugin interface
├── ui.js           # UI logic and interactions
├── package.json    # Project metadata
└── README.md       # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/figma-token-export/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about your setup and the issue

## Changelog

### v1.0.0
- Initial release
- Support for all variable types (colors, numbers, strings, booleans)
- Multi-mode export capability
- Variable alias handling
- Download and clipboard export options
- Live preview functionality

---

Made with ❤️ for the design and development community 