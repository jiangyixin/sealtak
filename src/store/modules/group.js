import { getMyGroups, getGroupInfo, getGroupMembers, updateGroupSetting, getMyGroupSetting, kickingMembers, joinMembers } from '../../api/group'
import Vue from 'vue'

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
          state.objGroups[group['groupId']] = Object.assign({}, state.objGroups[group['groupId']], group)
        } else {
          Vue.set(state.objGroups, group['groupId'], group)
        }
      }
    },
    DELETE_OBJ_GROUPS_ITEM: (state, [groupId, key]) => {
      delete state.objGroups[groupId][key]
    },
    SET_GROUP_MEMBERS: (state, [groupId, members]) => {
      if (!state.objGroups[groupId]) {
        Vue.set(state.objGroups, groupId, {})
      }
      Vue.set(state.objGroups[groupId], 'members', members)
    },
    SET_GROUP_INFO: (state, [groupId, info]) => {
      if (!state.objGroups[groupId]) {
        Vue.set(state.objGroups, groupId, {})
      }
      state.objGroups[groupId] = Object.assign({}, state.objGroups[groupId], info)
      Vue.set(state.objGroups[groupId], 'info', info)
    },
    SET_MY_GROUP_SETTING: (state, [groupId, mySetting]) => {
      if (!state.objGroups[groupId]) {
        Vue.set(state.objGroups, groupId, {})
      }
      Vue.set(state.objGroups[groupId], 'mySetting', mySetting)
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
    },
    kickingMembers({commit}, [groupId, params]) {
      return kickingMembers(groupId, params).then(data => {
        commit('DELETE_OBJ_GROUPS_ITEM', [groupId, 'members'])
        return data
      })
    },
    joinMembers({commit}, [groupId, form]) {
      return joinMembers(groupId, form).then(data => {
        commit('DELETE_OBJ_GROUPS_ITEM', [groupId, 'members'])
        return data
      })
    },
    getMyGroupSetting({commit, state}, groupId) {
      if (state.objGroups[groupId] && state.objGroups[groupId].mySetting) {
        return state.objGroups[groupId].mySetting
      } else {
        return getMyGroupSetting(groupId).then(data => {
          commit('SET_MY_GROUP_SETTING', [groupId, data])
          return data
        })
      }
    },
    updateGroupSetting({dispatch}, form) {
      return updateGroupSetting(form.groupId, form).then(data => {
        dispatch('getGroupInfo', form.groupId)
        return data
      })
    }
  },
  getters: {
    myGroups: state => state.myGroups,
    objGroups: state => state.objGroups
  }
}

export default group
