module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  overrides: [
    {
      files: [
        '.eslintrc*.js',
        'jest.config.js',
      ],
      rules: {
        'no-undef': 'off',
        'no-useless-escape': 'off',
      },
    }
  ]
}
