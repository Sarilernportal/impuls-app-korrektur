/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
08.11.2022

Scope:
Guardian Index
*/

//Import the modules from the module
import guardianMutations from './mutations.js'
import guardianGetters from './getters.js'
import guardianActions from './actions.js'

export default {
  state: {
    guardian: null
  },
  mutations: guardianMutations,
  getters: guardianGetters,
  actions: guardianActions
}
