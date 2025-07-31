module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off', // Allow console.log for debugging in Figma plugins
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  globals: {
    figma: 'readonly',
    __html__: 'readonly',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.config.js',
  ],
}; 