/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Store - Auth - Mutations
*/

export default {
  setUser(state, payload) {
    if (payload.user) {
      state.user = payload.user
      state.loggedIn = true
    } else {
      state.user = null
      state.loggedIn = false
    }
  },
  setUsername(state, payload) {
    state.username = payload.username
  },
  setUserGroup(state, payload) {
    state.userGroup = payload.userGroup
  }
}
