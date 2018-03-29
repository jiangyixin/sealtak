import cache from '../../utils/sessionStorage'
import { getUserInfo } from '../../api/friend'

const user = {
  state: {
    token: '',
    userId: 0,
    userInfo: {},
    curSidebar: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_CUR_SIDEBAR: (state, sidebar) => {
      let key = 'curSidebar'
      cache.set(key, sidebar)
      state.curSidebar = sidebar
    }
  },
  actions: {
    getUserInfo({commit}, params) {
      getUserInfo(params).then(data => {
        commit('SET_USER_ID', data.userId)
        commit('SET_USER_INFO', data)
      })
    }
  },
  getters: {
    token: state => state.token,
    userId: state => state.userId,
    userInfo: state => state.userInfo,
    curSidebar: state => {
      let key = 'curSidebar'
      return state.curSidebar || cache.get(key) || 'Conversations'
    }
  }
}

export default user
