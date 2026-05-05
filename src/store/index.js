/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus, Dustin Noack
20.09.2022

Scope:
Main Store
*/

import { createStore } from 'vuex'
// Root-Store-Components
import rootMutations from './mutations.js'
import rootActions from './actions.js'
import rootGetters from './getters.js'
// Modules
import authModule from './modules/auth/index.js'
import adminModule from './modules/admin/index.js'
import guardianModule from './modules/guardian/index.js'

export default createStore({
  state: {},
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters,
  modules: {
    auth: authModule,
    admin: adminModule,
    guardian: guardianModule,
  }
})
