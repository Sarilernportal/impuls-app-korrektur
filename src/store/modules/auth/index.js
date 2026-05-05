/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Store - Auth - Index
*/

//Import the modules from the module
import authMutations from './mutations.js'
import authGetters from './getters.js'
import authActions from './actions.js'

export default {
  state: {
    loggedIn: false,
    user: null
  },
  mutations: authMutations,
  getters: authGetters,
  actions: authActions
}
