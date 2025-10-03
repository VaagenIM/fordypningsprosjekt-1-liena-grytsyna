module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'windows'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': ['warn'],
    'no-unused-vars': ['warn']
  },
  ignorePatterns: [
    'dist/**',
    '.parcel-cache/**',
    'node_modules/**'
  ]
};