import { getMyFriends } from '../../api/friend'
import { groupByZh } from '../../utils/filter'

const friend = {
  state: {
    myFriends: [],
    groupFriends: []
  },
  mutations: {
    SET_MY_FRIENDS: (state, friends) => {
      state.myFriends = friends
    },
    SET_GROUP_FRIENDS: (state, friends) => {
      state.groupFriends = groupByZh(friends)
    }
  },
  actions: {
    getMyFriends({commit}, params) {
      getMyFriends(params).then(data => {
        commit('SET_MY_FRIENDS', data)
        commit('SET_GROUP_FRIENDS', data)
      })
    }
  },
  getters: {
    myFriends: state => state.myFriends,
    groupFriends: state => state.groupFriends
  }
}

export default friend
