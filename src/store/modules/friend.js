import { getMyFriends } from '../../api/friend'
import { groupByZh } from '../../utils/filter'

const friend = {
  state: {
    myFriends: [],
    groupFriends: [],
    objFriends: {}
  },
  mutations: {
    SET_MY_FRIENDS: (state, friends) => {
      state.myFriends = friends
    },
    SET_GROUP_FRIENDS: (state, friends) => {
      state.groupFriends = groupByZh(friends)
    },
    SET_OBJ_FRIENDS: (state, friends) => {
      for (let friend of friends) {
        state.objFriends[friend.friendUserId] = friend
      }
    }
  },
  actions: {
    getMyFriends({commit, state}, params) {
      if (state.myFriends && state.myFriends.length) {
        return Promise.resolve(state.myFriends)
      } else {
        getMyFriends(params).then(data => {
          commit('SET_MY_FRIENDS', data)
          commit('SET_GROUP_FRIENDS', data)
          commit('SET_OBJ_FRIENDS', data)
          return data
        })
      }
    }
  },
  getters: {
    myFriends: state => state.myFriends,
    groupFriends: state => state.groupFriends,
    objFriends: state => state.objFriends
  }
}

export default friend
