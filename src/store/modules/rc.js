import { getRCToken } from '../../api/user'
import cache from '../../utils/sessionStorage'

const rc = {
  state: {
    rcToken: '',
    initStatus: false,
    unreadCount: 0,
    conversations: [],
    curTargetId: '',
    curHistories: []
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
      state.conversations.push(message)
    },
    SET_CUR_TARGET_ID: (state, targetId) => {
      state.curTargetId = targetId
    },
    SET_CUR_HISTORIES: (state, histories) => {
      state.curHistories = histories
    },
    RECEIVE_NEW_MESSAGE: (state, message) => {
      for (let i in state.conversations) {
        if (state.conversations[i].targetId == message.targetId) {
          state.conversations[i].latestMessage = message
          state.conversations[i].sentTime = message.sentTime
          state.conversations[i].sentStatus = message.sentStatus
          state.conversations[i].objectName = message.objectName
          state.conversations[i].notificationStatus = message.sentStatus
          state.conversations[i].latestMessageId = message.messageId
          if (state.conversations[i].targetId == state.curTargetId) {
            state.conversations[i].unreadMessageCount = 0
          } else {
            state.conversations[i].unreadMessageCount++
          }
          break;
        }
      }
      if (state.curTargetId == message.targetId) {
        state.curHistories.push(message)
      }
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
    conversations: state => state.conversations,
    curTargetId: state => state.curTargetId
  }
}

export default rc
