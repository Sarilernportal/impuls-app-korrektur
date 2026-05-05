/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Store - Guardian - Getters
*/

export default {
  guardian(state) {
    return state.guardian
  },
  children(state) {
    return state.guardian.children.items
  }
}