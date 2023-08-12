module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    project: './tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
  },
  overrides: [
    {
      files: [
        '.eslintrc*.js',
        'jest.config.js',
      ],
      rules: {
        'no-undef': 'off',
      },
    }
  ]
}
