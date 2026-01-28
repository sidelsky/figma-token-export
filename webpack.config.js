const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return [
    // Plugin code (runs in Figma's sandbox)
    {
      name: 'plugin',
      target: 'web',
      mode: argv.mode,
      entry: './src/code.ts',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'code.js',
        clean: false, // Don't clean between builds since we have multiple entries
        library: {
          type: 'var',
          name: 'FigmaPlugin'
        },
        globalObject: 'this',
        iife: false
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      externals: {
        'figma': 'figma'
      },
      optimization: {
        minimize: false, // Disable minification for plugin code to avoid issues
      },

      devtool: isProduction ? false : 'source-map',
    }
    
    // UI build disabled - ui.html and ui.js in root are maintained directly
    // The root ui.html contains comprehensive features and is the source of truth
    // To make changes to the UI:
    // 1. Edit ui.html directly in the root directory
    // 2. Build only the plugin code with: npm run build
    // 3. Test in Figma
  ];
}; 