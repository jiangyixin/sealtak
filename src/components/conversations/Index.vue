<template>
  <el-aside width="315px" class="conversations-bar" style="height: 100%;">
    <ul class="conversation-list">
      <li v-for="(conversation, index) in conversations" :key="index">
        {{ conversation.targetId }}
        <div v-if="conversation.conversationType == 1" class="conversation">
          <div class="face"><img :src="objFriends[conversation['targetId']].headimgurl" alt=""></div>
          <div class="info"></div>
          <div class="extra"></div>
        </div>
      </li>
    </ul>
  </el-aside>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Conversations',
    computed: {
      ...mapGetters(['conversations', 'myGroups', 'objFriends'])
    },
    data () {
      return {

      }
    }
  }
</script>


<style scoped rel="stylesheet/scss" lang="scss">
  .conversation-list {
    list-style: none;
    padding-left: 5px;
    .conversation {
      display: flex;
      align-items: flex-start;
      justify-content: start;
      .face {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
      }
    }
  }
</style>
