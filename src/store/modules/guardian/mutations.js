/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
01.11.2022

Scope:
Store - Guardian - Mutations
*/

export default {
  setGuardian(state, payload) {
    if (payload.guardian) {
      state.guardian = payload.guardian
    } else {
      state.guardian = null
    }
  }
}
