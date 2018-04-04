import { getMyGroups, getGroupInfo, getGroupMembers } from '../../api/group'

const group = {
  state: {
    myGroups: [],
    objGroups: {}
  },
  mutations: {
    SET_MY_GROUPS: (state, groups) => {
      state.myGroups = groups
    },
    SET_OBJ_GROUPS: (state, groups) => {
      for (let group of groups) {
        if (state.objGroups[group['groupId']]) {
          Object.assign(state.objGroups[group['groupId']], group)
        } else {
          state.objGroups[group['groupId']] = group
        }
      }
    },
    SET_GROUP_MEMBERS: (state, [groupId, members]) => {
      if (!state.objGroups[groupId]) {
        state.objGroups[groupId] = {}
      }
      state.objGroups[groupId].members = members
    },
    SET_GROUP_INFO: (state, [groupId, info]) => {
      if (!state.objGroups[groupId]) {
        state.objGroups[groupId] = {}
      }
      state.objGroups[groupId].info = info
    }
  },
  actions: {
    getMyGroups({commit, state}) {
      if (state.myGroups && state.myGroups.length) {
        return Promise.resolve(state.myGroups)
      } else {
        return getMyGroups().then(data => {
          commit('SET_MY_GROUPS', data)
          commit('SET_OBJ_GROUPS', data)
          return data
        })
      }
    },
    getGroupInfo({commit, state}, groupId) {
      if (state.objGroups[groupId] && state.objGroups[groupId].info) {
        return state.objGroups[groupId].info
      } else {
        return getGroupInfo(groupId).then(data => {
          commit('SET_GROUP_INFO', [groupId, data[0]])
          return data[0]
        })
      }
    },
    getGroupMembers({commit, state}, groupId) {
      if (state.objGroups[groupId] && state.objGroups[groupId].members) {
        return state.objGroups[groupId].members
      } else {
        return getGroupMembers(groupId).then(data => {
          commit('SET_GROUP_MEMBERS', [groupId, data])
          return data
        })
      }
    }
  },
  getters: {
    myGroups: state => state.myGroups,
    objGroups: state => state.objGroups
  }
}

export default group
