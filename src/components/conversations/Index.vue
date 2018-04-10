<template>
  <el-aside width="330px" class="conversations-bar" style="height: 100%;">
    <ul class="conversation-list">
      <li v-for="(conversation, index) in conversations" :key="index" class="conversation-item">
        <conversation-item :conversation="conversation"></conversation-item>
      </li>
    </ul>
  </el-aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConversationItem from './Item.vue'
  let moment = require('moment')

  export default {
    name: 'Conversations',
    components: {
      ConversationItem
    },
    computed: {
      ...mapGetters(['conversations', 'objGroups', 'objFriends'])
    },
    data () {
      return {
        myConversations () {
          let myConversations = []

        }
      }
    },
    filters: {
      humanizeTime (timestramp, preTimestramp) {
        let str = ''
        if (preTimestramp && timestramp - preTimestramp < 3*60*1000) {
          return str
        }
        if (moment(moment(timestramp).format('YYYY-MM-DD HH:mm:ss')).isBetween(moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD HH:mm:ss'))) {
          str = moment(timestramp).format('HH:mm')
        } else {
          str = moment(timestramp).format('M-D')
        }
        return str
      }
    },
    created () {
      this.$store.dispatch('getMyFriends', {applyStatus: 'passed'}).then(resp => {

      })
      this.$store.dispatch('getMyGroups').then(resp => {

      })
    }
  }
</script>


<style scoped rel="stylesheet/scss" lang="scss">
  .conversations-bar {
    background-color: #f5f8fc;
  }
  .conversation-list {
    list-style: none;
    padding-left: 0;
    .conversation-item {

    }
  }
</style>
