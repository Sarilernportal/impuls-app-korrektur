module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  extends: ['plugin:vue/vue3-essential'],
  rules: {
    // Single-word view/component names are used throughout this project.
    'vue/multi-word-component-names': 'off',
    // Many components are referenced dynamically via <component :is>, which this
    // rule cannot detect, so it produces false positives here.
    'vue/no-unused-components': 'off'
  }
}
