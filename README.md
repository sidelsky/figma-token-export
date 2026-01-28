# Figma Design Token Export Plugin

A production-ready Figma plugin that exports design variables and tokens into developer-friendly formats, including W3C-compliant JSON, complete JSON, and CSS custom properties.

## Features

- 🎨 **Export Design Tokens**: Extract all local variable collections from Figma
- 📄 **Multiple Formats**: Export as W3C Developer JSON, complete JSON, or CSS custom properties
- ⭐ **W3C Compliant**: Clean, production-ready format following industry standards
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

**For UI Changes (90% of development):**
1. Edit `ui.html` directly in the project root
2. Reload the plugin in Figma (Cmd/Ctrl + Alt + P → Run last plugin)
3. No build step needed!

**For Plugin Logic Changes:**
1. Edit `src/code.ts`
2. Run `npm run build` to compile and copy to root
3. Reload the plugin in Figma

**Initial Setup in Figma:**
- Go to Plugins → Development → Import plugin from manifest
- Select the `manifest.json` file from this project

**Before committing:**
```bash
npm run validate
```

**Note**: See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed explanation of the build system.

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
│   ├── code.ts         # Main plugin logic (builds to dist/code.js)
│   ├── ui.ts           # UI logic reference (not actively built)
│   ├── ui.html         # UI template reference (not actively built)
│   └── types.ts        # TypeScript definitions
├── dist/               # Built plugin code
│   └── code.js         # Compiled plugin logic
├── ui.html             # Main UI file (source of truth, 5000+ lines)
├── ui.js               # UI JavaScript (maintained with ui.html)
├── code.js             # Symlink/copy of dist/code.js for Figma
├── webpack.config.js   # Build configuration
├── tsconfig.json       # TypeScript config
├── .eslintrc.js        # ESLint config
└── package.json        # Dependencies and scripts
```

### Build System

**Important**: This project uses a hybrid build approach:

- **Plugin code** (`src/code.ts`): Built via webpack to `dist/code.js`, then copied to root
- **UI files** (`ui.html`, `ui.js`): Maintained directly in the root directory (not built from `src/`)

The root `ui.html` is the comprehensive source with 5000+ lines of features. To make UI changes:
1. Edit `ui.html` directly in the project root
2. Test changes by reloading the plugin in Figma
3. For plugin logic changes, edit `src/code.ts` and run `npm run build`

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
   - **JSON**: Complete data with Figma metadata (for advanced use cases)
   - **CSS**: CSS custom properties (for direct CSS usage)
   - **Developer JSON**: Clean, W3C-compliant format (recommended for most developers)

3. **Export tokens:**
   - Click "Export Design Tokens"
   - Download or copy the generated code

### Export Formats

#### Developer JSON Format (W3C Compliant) ⭐ **Recommended**

Clean, production-ready format following the [W3C Design Tokens Community Group](https://design-tokens.github.io/community-group/format/) specification. Perfect for integration into codebases.

**Features:**
- ✅ No Figma-specific metadata
- ✅ Hierarchical organization by category
- ✅ Simple `$type`, `$value`, `$description` structure
- ✅ Compatible with Style Dictionary, Theo, and other token tools
- ✅ Easy to consume in any programming language

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#0095ff",
      "$description": "Primary brand color"
    },
    "text": {
      "primary": {
        "$type": "color",
        "$value": "#111827"
      },
      "secondary": {
        "$type": "color",
        "$value": "#6b7280"
      }
    }
  },
  "spacing": {
    "xs": {
      "$type": "number",
      "$value": 4
    },
    "sm": {
      "$type": "number",
      "$value": 8
    },
    "md": {
      "$type": "number",
      "$value": 16
    }
  }
}
```

**Automatic categorization:**
- `colors` - Color tokens
- `spacing` - Spacing/sizing tokens
- `typography` - Font families, sizes, weights
- `borderRadius` - Border radius values
- `shadows` - Shadow definitions
- And more...

#### JSON Format (Complete)

Full export with all Figma metadata, modes, and collection information. Use this when you need complete data or are building advanced tooling.

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

Ready-to-use CSS custom properties with automatic theme support.

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