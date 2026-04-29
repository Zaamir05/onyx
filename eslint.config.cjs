const js = require('@eslint/js')
const globals = require('globals')
const importPlugin = require('eslint-plugin-import')
const nPlugin = require('eslint-plugin-n')
const promisePlugin = require('eslint-plugin-promise')

module.exports = [
  {
    ignores: ['client/**']
  },
  {
    files: ['**/*.js'],
    plugins: {
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...nPlugin.configs['flat/recommended'].rules,
      ...promisePlugin.configs['flat/recommended'].rules,
      'no-console': 'off'
    }
  }
]
