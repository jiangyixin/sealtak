<template>
  <router-link :to="{ name: 'Chat', params: { targetId: info.targetId, conversationType: info.conversationType } }" class="conversation">
    <div class="face"><img :src="info.headimgurl" alt=""></div>
    <div class="info">
      <div class="name">{{ info.nickname }}</div>
      <div class="msg">{{ info.msgContent }}</div>
    </div>
    <div class="extra">
      <div class="date">{{ info.sentTime|humanizeTime }}</div>
      <div class="num">{{ info.unreadMessageCount }}</div>
    </div>
  </router-link>
</template>

<script>
  import { mapGetters } from 'vuex'
  let moment = require('moment')

  export default {
    name: 'ConversationItem',
    props: [
      'conversation'
    ],
    data () {
      return {

      }
    },
    computed: {
      ...mapGetters(['objGroups', 'objFriends', 'userId']),
      info () {
        let conversation = this.conversation
        let info = {
          targetId: conversation.targetId,
          conversationType: conversation.conversationType,
          sentTime: conversation.sentTime,
          unreadMessageCount: conversation.unreadMessageCount,
          latestMessage: conversation.latestMessage
        }
        switch (conversation.conversationType) {
          case 1:
            info.headimgurl = this.objFriends[conversation['targetId']].headimgurl
            info.nickname = this.objFriends[conversation['targetId']].nickname
            break;
          case 3:
            info.headimgurl = this.objGroups[conversation['targetId']] && this.objGroups[conversation['targetId']].groupHeadimgurl
            info.nickname = this.objGroups[conversation['targetId']] && this.objGroups[conversation['targetId']].groupName
            break;
          default:

            break;
        }
        let message = conversation.latestMessage.content
        switch (conversation.objectName) {
          case 'RC:TxtMsg':
            var content = message.content.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
            if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
              content = RongIMLib.RongIMEmoji.emojiToHTML(content)
            }
            info.msgContent = content
            break;
          case 'RC:ImgMsg':
            info.msgContent = '[图片]'
            break;
          case 'RC:VcMsg':
            info.msgContent = '[语音]'
            break;
          case 'RC:ImgTextMsg':
            info.msgContent = '[图文]'
            break;
          case 'RC:LBSMsg':
            info.msgContent = '[位置]'
            break;
          case 'RC:FileMsg':
            info.msgContent = '[文件]'
            break;
          case 'RC:CmdNtf':
          case 'RC:ContactNtf':
            info.msgContent = '[通知消息]'
            break;
          case 'RC:InfoNtf':
            info.msgContent = message.message
            break;
          case 'RC:GrpNtf':
            info.msgContent = message.message
            break;
          case 'RC:DizNtf':

            break;
          default:

            break;
        }
        info.latestMessage.content = message
        return info
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
