import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
import Info from '../views/info/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/info',
      name: 'Info',
      component: Info
    }
  ]
})
