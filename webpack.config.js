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
        minimize: isProduction,
      },
      devtool: isProduction ? false : 'source-map',
    },
    
    // UI code (runs in iframe)
    {
      name: 'ui',
      target: 'web',
      mode: argv.mode,
      entry: './src/ui.ts',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ui.js',
        clean: false,
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/ui.html',
          filename: 'ui.html',
          chunks: ['ui'],
          inject: 'body',
          minify: isProduction ? {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          } : false,
        }),
      ],
      optimization: {
        minimize: isProduction,
      },
      devtool: isProduction ? false : 'source-map',
    },
  ];
}; 