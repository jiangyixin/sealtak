import { getRCToken } from '../../api/user'
import { getHistoryMsg, sendMsg, clearUnreadCount } from '../../api/rcMsg'
import cache from '../../utils/sessionStorage'

const rc = {
  state: {
    rcToken: '',
    initStatus: false,
    unreadCount: 0,
    conversations: [],
    curConversation: {
      conversationType: 0,
      targetId: 0,
      hasMsg: true,
      histories: [],
      newMsg: 0
    },
    rcHistories: {}
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
    SET_CUR_CONVERSATION: (state, conversation) => {
      Object.assign(state.curConversation, conversation)
    },
    ADD_OLD_HISTORY: (state, [list, hasMsg]) => {
      state.curConversation.histories.unshift(...list)
      state.curConversation.hasMsg = hasMsg
    },
    ADD_NEW_HISTORY: (state, message) => {
      state.curConversation.histories.push(message)
    },
    ADD_CONVERSATIONS: (state, message) => {
      state.conversations.push(message)
    },
    CLEAR_UNREAD_COUNT: (state, conversation) => {
      for (let i in state.conversations) {
        if (state.conversations[i].targetId == conversation.targetId) {
          state.conversations[i].unreadCount = 0
          break
        }
      }
    },
    RECEIVE_NEW_MESSAGE: (state, message) => {
      console.log('---RECEIVE_NEW_MESSAGE---')
      for (let i in state.conversations) {
        if (state.conversations[i].targetId == state.curConversation.targetId) {
          state.conversations[i].latestMessage = message
          state.conversations[i].sentTime = message.sentTime
          state.conversations[i].sentStatus = message.sentStatus
          state.conversations[i].objectName = message.objectName
          state.conversations[i].notificationStatus = message.sentStatus
          state.conversations[i].latestMessageId = message.messageId
          if (state.conversations[i].targetId == state.curConversation.targetId) {
            state.conversations[i].unreadMessageCount = 0
          } else {
            state.conversations[i].unreadMessageCount++
          }
          state.curConversation.histories.push(message)
          state.curConversation.newMsg++
          break
        }
      }
      let key = message.conversationType + '-' + message.targetId
      if (state.rcHistories[key]) {
        state.rcHistories[key].histories.push(message)
      } else {
        state.rcHistories[key] = {
          histories: [message],
          hasMsg: true
        }
      }
    },
    SET_HISTORIES: (state, conversation) => {
      let key = conversation.conversationType + '-' + conversation.targetId
      if (state.rcHistories[key]) {
        state.rcHistories[key].histories.unshift(...conversation.histories)
        state.rcHistories[key].hasMsg = conversation.hasMsg
      } else {
        state.rcHistories[key] = {
          histories: conversation.histories,
          hasMsg: conversation.hasMsg
        }
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
        return getRCToken().then(data => {
          commit('SET_RC_TOKEN', data.token)
          cache.set(key, data.token)
          return data.token
        })
      }
    },
    getHistoryMsg({commit, state}, params) {
      let key = state.curConversation.conversationType + '-' + state.curConversation.targetId
      if (state.rcHistories[key] && params.first) {
        commit('SET_CUR_CONVERSATION', state.rcHistories[key])
        return Promise.resolve(state.curConversation)
      } else if (state.curConversation.histories && !state.curConversation.hasMsg) {
        return Promise.resolve(state.curConversation)
      } else {
        return getHistoryMsg(state.curConversation.conversationType, state.curConversation.targetId, params.timestramp, params.limit).then(([list, hasMsg]) => {
          commit('ADD_OLD_HISTORY', [list, hasMsg])
          commit('SET_HISTORIES', {conversationType: state.curConversation.conversationType, targetId: state.curConversation.targetId, histories: list, hasMsg: hasMsg})
          return state.curConversation
        })
      }
    },
    sendMsg({commit, state}, conversation) {
      return sendMsg(conversation.conversationType, conversation.targetId, conversation.message, conversation.at).then((message) => {
        commit('ADD_NEW_HISTORY', message)
        return message
      })
    },
    clearUnreadCount({commit}, conversation) {
      return clearUnreadCount(conversation.conversationType, conversation.targetId).then(() => {
        commit('CLEAR_UNREAD_COUNT', conversation)
      })
    }
  },
  getters: {
    rcToken: state => state.rcToken,
    initStatus: state => state.initStatus,
    unreadCount: state => state.unreadCount,
    conversations: state => state.conversations,
    curConversation: state => state.curConversation,
    rcHistories: state => state.rcHistories
  }
}

export default rc
