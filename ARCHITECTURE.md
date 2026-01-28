# Project Architecture

## Build System Overview

This project uses a **hybrid build approach** to maintain both development workflow and production requirements.

### File Structure

```
figma-token-export/
├── src/                    # TypeScript source files
│   ├── code.ts            # Plugin logic (ACTIVELY BUILT)
│   ├── types.ts           # Type definitions
│   ├── ui.html            # Legacy UI template (NOT BUILT)
│   └── ui.ts              # Legacy UI logic (NOT BUILT)
│
├── dist/                  # Webpack build output
│   └── code.js           # Compiled plugin code
│
├── Root Files (Used by Figma)
│   ├── code.js           # Copy of dist/code.js (auto-generated)
│   ├── ui.html           # Comprehensive UI (5000+ lines, EDIT DIRECTLY)
│   ├── ui.js             # UI JavaScript (maintained manually)
│   └── manifest.json     # Figma plugin manifest
```

## Key Points

### 1. Plugin Code (`src/code.ts`)
- **Source of truth**: `src/code.ts`
- **Build process**: TypeScript → Webpack → `dist/code.js` → copied to `code.js`
- **How to edit**: 
  1. Edit `src/code.ts`
  2. Run `npm run build`
  3. The built `code.js` is automatically copied to root

### 2. UI Files (`ui.html`, `ui.js`)
- **Source of truth**: Root `ui.html` and `ui.js` files
- **Build process**: NONE - these files are maintained directly
- **How to edit**:
  1. Edit `ui.html` or `ui.js` directly in the project root
  2. No build step required
  3. Reload plugin in Figma to test

### 3. Why This Approach?

The root `ui.html` file contains:
- 5000+ lines of comprehensive UI code
- Inline JavaScript for all UI logic
- Advanced features, styling, and interactions
- Complete implementation that evolved beyond the simple `src/ui.html`

Rather than rebuilding from scratch or maintaining two separate UI implementations, we:
- Keep the comprehensive `ui.html` as the source of truth
- Only build the plugin code (`code.ts`) via webpack
- Document this clearly to avoid confusion

## Development Workflow

### Making Plugin Logic Changes

```bash
# Edit src/code.ts
npm run build          # Compiles and copies to root
# Test in Figma
```

### Making UI Changes

```bash
# Edit ui.html directly in root
# No build needed - just reload plugin in Figma
```

### Watch Mode (for plugin code only)

```bash
npm run dev           # Watches src/code.ts for changes
# Note: You'll need to manually copy dist/code.js to code.js
# or reload Figma to see changes
```

## Build Scripts

- `npm run build` - Production build (compiles code.ts, copies to root)
- `npm run build:dev` - Development build with source maps
- `npm run build:watch` - Watch mode (doesn't auto-copy)
- `npm run copy-build` - Copy dist/code.js to code.js
- `npm run validate` - Run type-check and lint

## Important Notes

1. **Never edit `dist/code.js` or `code.js` directly** - changes will be overwritten
2. **Always edit `ui.html` in the root** - not `src/ui.html`
3. **The `src/ui.html` and `src/ui.ts` files are legacy** - kept for reference but not used in build
4. **Root files (`code.js`, `ui.html`, `ui.js`) are committed** because Figma needs them

## Migration Path (Future)

If you want to fully migrate to a proper build system:

1. Extract JavaScript from `ui.html` into a proper `ui.ts` file
2. Re-enable the UI webpack build in `webpack.config.js`
3. Port all features from root `ui.html` to `src/ui.html` + `src/ui.ts`
4. Update `.gitignore` to exclude built files
5. Update documentation

This would be a significant refactor (5000+ lines) but would provide better:
- Type safety
- Code splitting
- Module organization
- Development experience
