//Import the modules from the module
import adminMutations from './mutations.js'
import adminGetters from './getters.js'
import adminActions from './actions.js'

export default {
  state: {
    loggedIn: false,
    user: null
  },
  mutations: adminMutations,
  getters: adminGetters,
  actions: adminActions
}
