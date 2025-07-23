# Figma Design Token Export Plugin

A production-ready Figma plugin that exports design variables and tokens into developer-friendly JSON and CSS formats.

## Features

- 🎨 **Export Design Tokens**: Extract all local variable collections from Figma
- 📄 **Multiple Formats**: Export as JSON or CSS custom properties
- 🔄 **Mode Support**: Handle multiple modes (light/dark themes)
- 🎯 **Type Safety**: Built with TypeScript for reliability
- 📱 **Modern UI**: Clean, responsive interface
- 🚀 **Production Ready**: Optimized build system with webpack

## Development

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development build:**
   ```bash
   npm run dev
   ```

3. **Production build:**
   ```bash
   npm run build
   ```

### Build Scripts

- `npm run build` - Production build with minification
- `npm run build:dev` - Development build with source maps
- `npm run build:watch` - Watch mode for development
- `npm run dev` - Alias for watch mode
- `npm run lint` - Run ESLint with auto-fix
- `npm run type-check` - TypeScript type checking
- `npm run test` - Run Jest tests
- `npm run validate` - Run all checks (types, lint, tests)
- `npm run clean` - Clean build directory

### Development Workflow

1. **Start development:**
   ```bash
   npm run dev
   ```

2. **In Figma:**
   - Go to Plugins → Development → Import plugin from manifest
   - Select the `manifest.json` file from this project
   - The plugin will auto-reload when you make changes

3. **Before committing:**
   ```bash
   npm run validate
   ```

## Production Deployment

### Building for Production

1. **Clean build:**
   ```bash
   npm run clean && npm run build
   ```

2. **Validate build:**
   ```bash
   npm run validate
   ```

3. **Files for submission:**
   - `dist/code.js` - Main plugin code
   - `dist/ui.html` - UI HTML file
   - `dist/ui.js` - UI JavaScript (bundled)
   - `manifest.json` - Plugin manifest

### Figma Plugin Store Submission

1. **Prepare assets:**
   - Plugin icon (128x128 and 256x256)
   - Cover image (1920x960)
   - Screenshots

2. **Testing checklist:**
   - [ ] Plugin loads without errors
   - [ ] All features work as expected
   - [ ] UI is responsive and accessible
   - [ ] Error handling works properly
   - [ ] No console errors or warnings

3. **Submit to Figma:**
   - Upload built files to Figma
   - Fill out plugin details
   - Submit for review

### Performance Optimizations

- **Code splitting**: Separate bundles for plugin and UI code
- **Minification**: Production builds are minified
- **Tree shaking**: Unused code is eliminated
- **Source maps**: Available in development builds

## Architecture

### Project Structure

```
figma-token-export/
├── src/                 # Source code
│   ├── code.ts         # Main plugin logic
│   ├── ui.ts           # UI logic
│   ├── ui.html         # UI template
│   └── types.ts        # TypeScript definitions
├── dist/               # Built files
├── tests/              # Test files
├── webpack.config.js   # Build configuration
├── tsconfig.json       # TypeScript config
├── .eslintrc.js        # ESLint config
├── jest.config.js      # Jest config
└── package.json        # Dependencies and scripts
```

### Technology Stack

- **TypeScript**: Type safety and better developer experience
- **Webpack**: Module bundling and optimization
- **ESLint + Prettier**: Code quality and formatting
- **Jest**: Unit testing framework
- **Figma Plugin API**: Plugin functionality

## Usage

1. **Open the plugin in Figma:**
   - Select "Design Token Export" from the plugins menu

2. **Choose export format:**
   - JSON: For JavaScript/build tools
   - CSS: For direct CSS usage

3. **Export tokens:**
   - Click "Export Design Tokens"
   - Download or copy the generated code

### Export Formats

#### JSON Format
```json
{
  "metadata": {
    "exportedAt": "2024-01-01T00:00:00.000Z",
    "figmaFileKey": "your-file-key",
    "collections": 2
  },
  "collections": {
    "Colors": {
      "variables": {
        "primary": {
          "values": {
            "Default": "#007AFF"
          }
        }
      }
    }
  }
}
```

#### CSS Format
```css
:root {
  /* Mode: Default */
  --colors-primary: #007AFF;
  --spacing-base: 16px;
}

[data-theme="dark"] {
  /* Mode: Dark */
  --colors-primary: #0A84FF;
}
```

## Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature-name`
3. **Make changes and test:** `npm run validate`
4. **Commit changes:** `git commit -m "Description"`
5. **Push to branch:** `git push origin feature-name`
6. **Create Pull Request**

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/figma-token-export/issues)
- **Documentation**: This README and code comments
- **Figma Community**: [Plugin Page](https://figma.com/community/plugin/your-plugin-id) 