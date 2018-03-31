import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import UserInfo from '../views/info/UserInfo.vue'
import UserChat from '../views/chat/UserChat.vue'
import GroupChat from '../views/chat/GroupChat.vue'
import Chat from '../views/chat/Chat.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/chat/:conversationType/:targetId',
      name: 'Chat',
      component: Chat,
      props: true
    },
    {
      path: '/user-info/:userId',
      name: 'UserInfo',
      component: UserInfo,
      props: true
    },
    {
      path: '/user-chat/:userId',
      name: 'UserChat',
      component: UserChat,
      props: true
    },
    {
      path: '/group-chat/:groupId',
      name: 'GroupChat',
      component: GroupChat,
      props: true
    }
  ]
})
