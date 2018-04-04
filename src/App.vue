<template>
  <el-container id="app">
    <el-aside width="400px" style="overflow: hidden;">
      <Sidebar></Sidebar>
      <component :is="curSidebar"></component>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Sidebar from './components/Sidebar.vue'
  import Contacts from './components/contacts/Index.vue'
  import Conversations from './components/conversations/Index.vue'
  import { init } from './api/rcInit'
  import { getConversations, getTotalUnreadCount } from './api/rcMsg'

  export default {
    name: 'App',
    components: {
        Sidebar, Contacts, Conversations
    },
    computed: {
      ...mapGetters(['rcToken', 'curSidebar'])
    },
    methods: {

    },
    created () {
      this.$store.dispatch('getUserProfile').then(resp => {

      })
      this.$store.dispatch('getRCToken').then(resp => {
        let that = this
        let params = {
          appKey : process.env.APP_KEY,
          token : this.rcToken
        }
        init(params, {
          getInstance: (instance) => {
            getConversations().then(list => {
              this.$store.commit('SET_CONVERSATIONS', list)
            })
            getTotalUnreadCount().then(count => {
              this.$store.commit('SET_UNREAD_COUNT', count)
            })
          },
          receiveNewMessage: (message) => {
            console.log(message)
            that.$store.commit('UPDATE_UNREAD_COUNT', 1)
            that.$store.commit('RECEIVE_NEW_MESSAGE', message)
          },
          getCurrentUser: ({userId}) => {

          }
        })
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  html, body, .el-container {
    margin: 0;
    height: 100%;
  }

  .el-main {
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  }

  .fa-icon {
    width: auto;
    height: 1em; /* 或任意其它字体大小相对值 */
    /* 要在 Safari 中正常工作，需要再引入如下两行代码 */
    max-width: 100%;
    max-height: 100%;
  }

</style>
