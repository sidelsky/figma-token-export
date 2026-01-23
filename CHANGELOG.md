# Changelog

All notable changes to the Figma Design Token Export plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-23

### Added
- **GitHub Integration**: Push design tokens directly to GitHub repositories
  - One-click push to any GitHub repository
  - Support for all export formats (JSON, CSS, Developer JSON)
  - Automatic file creation and updates via GitHub API
  - Settings persistence in browser localStorage
  - Secure GitHub Personal Access Token authentication
  - Direct links to commits after successful push
  - Repository URL parsing (supports multiple formats)
  - Comprehensive error handling and user feedback
  - Collapsible GitHub settings panel in UI

### Changed
- Updated `manifest.json` to allow network access to `api.github.com`
- Enhanced UI with GitHub configuration section
- Added GitHub settings form with repository, branch, file path, and token inputs
- Updated build process to include UI bundling with esbuild

### Technical Details
- Added `src/github.ts` module with GitHub API integration
  - `pushToGitHub()` - Push content to repository
  - `validateGitHubConfig()` - Validate repository access
  - `parseRepoUrl()` - Parse various repository URL formats
- Extended TypeScript types for GitHub settings and messages
- Implemented settings persistence using localStorage
- Added commit message customization
- Base64 encoding for file content
- SHA retrieval for file updates

### Documentation
- Added comprehensive `GITHUB_INTEGRATION.md` guide
  - Setup instructions
  - Security best practices
  - Troubleshooting guide
  - Workflow examples
- Updated README with GitHub integration section
- Added quick start guide for GitHub push feature

## [1.2.0] - 2026-01-23

### Added
- **Developer JSON Export Format**: New W3C Design Tokens Community Group compliant export option
  - Clean, production-ready JSON structure without Figma metadata
  - Hierarchical organization by token categories (colors, spacing, typography, etc.)
  - Simple `$type`, `$value`, `$description` structure
  - Compatible with Style Dictionary, Theo, and other design token tools
  - Automatic categorization of tokens based on collection names
  - Smart token name parsing for nested structures (supports `/`, `-`, `_`, and camelCase)
  - Recommended format for most developer use cases

### Changed
- Updated UI to include three export format options: JSON (Complete), CSS, and Developer JSON (W3C)
- Enhanced README with comprehensive documentation of all export formats
- Added example output file demonstrating the Developer JSON format

### Technical Details
- Added `convertToDeveloperFormat()` function for W3C-compliant transformation
- Implemented automatic token categorization logic
- Added token name parsing for hierarchical structure creation
- Extended TypeScript types to support the new format
- All existing formats remain unchanged and fully functional

## [1.1.0] - 2024-01-23

### Added
- **Production Build System**: Complete webpack-based build pipeline
- **TypeScript Support**: Full TypeScript conversion with strict type checking
- **Code Quality Tools**: ESLint, Prettier, and comprehensive linting rules
- **Testing Framework**: Jest setup with test utilities and mocks
- **Multiple Export Formats**: JSON and CSS custom properties export
- **Development Workflow**: Watch mode, hot reloading, and validation scripts
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimizations**: Code minification, tree shaking, and bundling

### Changed
- **Project Structure**: Reorganized into `src/` directory with build output in `dist/`
- **Build Process**: Automated build pipeline with production optimizations
- **Type Safety**: Converted JavaScript to TypeScript for better reliability
- **Code Organization**: Modular structure with proper separation of concerns

### Technical Improvements
- **Webpack Configuration**: Dual build targets for plugin and UI code
- **Source Maps**: Available in development builds for debugging
- **Asset Optimization**: HTML minification and CSS optimization
- **Bundle Splitting**: Separate bundles for different plugin components
- **Validation Pipeline**: Automated type checking, linting, and testing

### Developer Experience
- **Development Scripts**: `npm run dev` for watch mode
- **Validation Commands**: `npm run validate` for comprehensive checks
- **Clean Build Process**: `npm run clean && npm run build`
- **Documentation**: Updated README with complete development guide

## [1.0.0] - 2024-01-15

### Added
- **Initial Release**: Basic Figma plugin functionality
- **Variable Export**: Export all local variable collections
- **Multi-Mode Support**: Handle light/dark themes and other modes
- **Variable Types**: Support for colors, numbers, strings, and booleans
- **Alias Handling**: Proper export of variable aliases and references
- **JSON Export**: Developer-friendly JSON format
- **CSS Export**: CSS custom properties format
- **Live Preview**: Real-time preview of export data
- **Download Options**: Download JSON or CSS files
- **Clipboard Support**: Copy exported data to clipboard
- **Format Switching**: Toggle between JSON and CSS formats

### Features
- Clean, modern UI matching Figma's design language
- Comprehensive error handling and user feedback
- Exact mode name preservation in CSS output
- Smart CSS variable naming conventions
- Usage examples in exported CSS files
- Metadata tracking (export time, file key, collection count)

### Supported Variable Types
- **Colors**: Hex codes and RGBA values with alpha support
- **Numbers**: Float values for spacing, sizing, etc.
- **Strings**: Text values for typography, content, etc.
- **Booleans**: Boolean values for feature flags, etc.

---

## Development Notes

### Version 1.1.0 Focus
This major update focused on making the plugin production-ready with:
- Professional build system and tooling
- Type safety and code quality improvements
- Comprehensive testing framework
- Optimized performance and bundle size
- Better error handling and user experience

### Future Roadmap
- [ ] Advanced CSS output options (SCSS, CSS Modules)
- [ ] Integration with popular design token libraries
- [ ] Batch export for multiple files
- [ ] Custom naming conventions
- [ ] Plugin API for programmatic usage 