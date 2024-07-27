module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    curly: ['error', 'all'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'no-unused-vars': ['error', { vars: 'all', argsIgnorePattern: '^_' }],
    'comma-dangle': ['error', 'never'],
    'max-len': [
      'error',
      {
        code: 110,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'arrow-body-style': ['off']
  }
};
