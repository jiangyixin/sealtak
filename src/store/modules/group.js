import { getMyGroups } from '../../api/group'

const group = {
  state: {
    myGroups: []
  },
  mutations: {
    SET_MY_GROUPS: (state, groups) => {
      state.myGroups = groups
    }
  },
  actions: {
    getMyGroups({commit}) {
      getMyGroups().then(data => {
        commit('SET_MY_GROUPS', data)
      })
    }
  },
  getters: {
    myGroups: state => state.myGroups
  }
}

export default group
