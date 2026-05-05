/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Babel Config file
*/

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/env',
      {
        targets: {
          node: '14'
        }
      }
    ]
  ]
}
