/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Store - Auth - Getters
*/

export default {
  user(state) {
    return state.user
  },
  userGroup(state) {
    if (state.user) {
      const group =
        state.user.signInUserSession.accessToken.payload['cognito:groups'][0]
      return group
    }
    return null
  },
  userIsAdmin(state) {
    if (state.user) {
      const group =
        state.user.signInUserSession.accessToken.payload['cognito:groups'][0]
      if (group === 'Admin') {
        return true
      }
      return false
    }
    return null
  },
  userIsGuardian(state) {
    if (state.user) {
      const group =
        state.user.signInUserSession.accessToken.payload['cognito:groups'][0]
      if (group === 'Guardian') {
        return true
      }
      return false
    }
    return null
  },
  phoneNumber(state) {
    if (state.user && state.user.attributes.phone_number) {
      return state.user.attributes.phone_number
    }
    return null
  },
  username(state) {
    if (state.user) {
      return state.user.user.username
    } else {
      return state.username
    }
  },
  loggedIn(state) {
    return state.loggedIn
  }
}
