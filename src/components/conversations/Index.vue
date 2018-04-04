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
      border-bottom: 1px solid #e1e9f1;
    }
    .conversation {
      display: flex;
      align-items: flex-start;
      justify-content: start;
      padding: 8px 10px;
      cursor: pointer;
      text-decoration: inherit;
      color: inherit;
      &:active,
      &:hover {
        background-color: #ebf2f7;
      }
      .face {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
        font-size: 15px;
        .name {
          margin-bottom: 2px;
        }
        .msg {
          font-size: 14px;
          color: #999;
        }
      }
      .extra {
        font-size: 13px;
        .date {
          color: #999;
          margin-bottom: 5px;
        }
        .num {
          font-size: 12px;
          display: inline-block;
          padding: 2px 6px;
          background-color: #09f;
          border-radius: 15px;
          text-align: center;
          color: #fff;
        }
      }
    }
  }
</style>
