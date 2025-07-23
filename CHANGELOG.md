# Changelog

All notable changes to the Figma Design Token Export plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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