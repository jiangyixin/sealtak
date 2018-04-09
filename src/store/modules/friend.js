import { getMyFriends, getFriendInfo } from '../../api/friend'
import { groupByZh } from '../../utils/filter'
import Vue from 'vue'

const friend = {
  state: {
    myFriends: [],
    groupFriends: [],
    objFriends: {},
    friendInfo: {}
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
        Vue.set(state.objFriends, friend.friendUserId, friend)
      }
    },
    UPDATE_OBJ_FRIENDS: (state, friend) => {
      Vue.set(state.objFriends, friend.userId, friend)
    },
    SET_FRIEND_INFO: (state, friend) => {
      state.friendInfo = friend
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
    },
    getFriendInfo({commit, state}, params) {
      if (state.objFriends[params.userId]) {
        return Promise.resolve(state.objFriends[params.userId])
      } else {
        return getFriendInfo(params).then(data => {
          commit('SET_FRIEND_INFO', data)
          commit('UPDATE_OBJ_FRIENDS', data)
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
