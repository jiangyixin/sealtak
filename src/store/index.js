import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import friend from './modules/friend'
import group from './modules/group'
import user from './modules/user'
import rc from './modules/rc'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    friend,
    group,
    user,
    rc
  },
  getters
})

export default store
