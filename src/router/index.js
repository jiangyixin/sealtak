import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import UserInfo from '../views/info/UserInfo.vue'
import GroupInfo from '../views/info/GroupInfo.vue'
import Chat from '../views/chat/Chat.vue'
import Bulletin from '../views/group/Bulletin.vue'
import ApplyFriend from '../views/friend/ApplyFriend.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chat/:conversationType/:targetId',
      name: 'Chat',
      component: Chat,
      props: (router) => ({
        conversationType: parseInt(router.params.conversationType),
        targetId: router.params.targetId + ''
      })
    },
    {
      path: '/user-info/:userId',
      name: 'UserInfo',
      component: UserInfo,
      props: (router) => ({
        userId: router.params.userId,
        applyFrom: router.query.applyFrom,
        fromRemark: router.query.fromRemark
      })
    },
    {
      path: '/apply-friend/:friendUserId',
      name: 'ApplyFriend',
      component: ApplyFriend,
      props: (router) => ({
        friendUserId: router.params.friendUserId,
        applyFrom: router.query.applyFrom,
        fromRemark: router.query.fromRemark
      })
    },
    {
      path: '/group-info/:groupId',
      name: 'GroupInfo',
      component: GroupInfo,
      props: true
    },
    {
      path: '/group-bulletin/:groupId',
      name: 'Bulletin',
      component: Bulletin,
      props: true
    },
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
