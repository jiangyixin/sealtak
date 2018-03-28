import { getRCToken } from '../../api/user'
import cache from '../../utils/sessionStorage'

const rc = {
  state: {
    rcToken: '',
    initStatus: false,
    unreadCount: 0,
    conversations: {}
  },
  mutations: {
    SET_RC_TOKEN: (state, rcToken) => {
      state.rcToken = rcToken
    },
    SET_INIT_STATUS: (state, status) => {
      state.initStatus = status
    },
    SET_UNREAD_COUNT: (state, unreadCount) => {
      state.unreadCount = unreadCount
    },
    UPDATE_UNREAD_COUNT: (state, newCount) => {
      state.unreadCount = state.unreadCount + newCount
    },
    SET_CONVERSATIONS: (state, conversations) => {
      state.conversations = conversations
    },
    UPDATE_CONVERSATIONS: (state, message) => {

    }
  },
  actions: {
    getRCToken({commit}) {
      let key = 'rcToken'
      if (cache.has(key)) {
        commit('SET_RC_TOKEN', cache.get(key))
        return Promise.resolve(cache.get(key))
      } else {
        getRCToken().then(data => {
          commit('SET_RC_TOKEN', data.token)
          cache.set(key, data.token)
        })
      }
    },
  },
  getters: {
    rcToken: state => state.rcToken,
    initStatus: state => state.initStatus,
    unreadCount: state => state.unreadCount,
    conversations: state => state.conversations
  }
}

export default rc
