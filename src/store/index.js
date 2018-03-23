import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import friend from './modules/friend'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    friend
  },
  getters
})

export default store
