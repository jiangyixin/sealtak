<template>
  <el-container>
    <el-header>
      <h3 class="title">{{ friendInfo.nickname }}</h3>
    </el-header>
    <el-main id="chatroom">
      <div class="message-block">
        <ul class="message-list">
          <li v-for="(msg, index) in historyMsg" :key="index" class="message-item">
            <div class="msg-date">{{ msg.sentTime|humanizeTime(historyMsg[index-1] && historyMsg[index-1].sentTime) }}</div>
            <div class="msg-card">
              <div class="face"><img :src="chatUsers[msg.senderUserId].headimgurl" alt=""></div>
              <div class="info">
                <div class="name">{{ chatUsers[msg.senderUserId].nickname }}</div>
                <div class="msg">
                  <div class="text-msg" v-if="msg.content.messageName == 'TextMessage'">{{ msg.content.content }}</div>
                  <img class="image-msg" v-if="msg.content.messageName == 'ImageMessage'" :src="msg.content.imageUri" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-main>
    <el-footer height="100px">
      <div class="input-box">
        <div class="message-form">
          <!--<pre v-text="replyText" ref="reply" @input="replyText = $event.target.innerText" class="text-area" contenteditable="true" placehlder="请输入文字"></pre>-->
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            placeholder="请输入内容"
            v-model="replyText">
          </el-input>
          <el-button class="btn-send" type="text" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getFriendInfo } from '../../api/friend'
  import { getHistoryMsg, sendTextMsg } from '../../api/rcMsg'
  let moment = require('moment')

  export default {
    name: 'UserChat',
    components: {

    },
    props: ['userId'],
    data () {
      return {
        friendInfo: {},
        replyText: '',
        historyMsg: [],
        hasMsg: false
      }
    },
    computed: {
      ...mapGetters(['initStatus', 'userInfo', 'curTargetId', 'curHistories']),
      chatUsers () {
        return {
          [this.userInfo['userId']]: this.userInfo,
          [this.friendInfo['userId']]: this.friendInfo
        }
      }
    },
    created () {
      this.resetChatInfo()
      let that = this
      let initInterval = setInterval(function () {
        if (that.initStatus) {
          clearInterval(initInterval)
          getHistoryMsg(1, that.userId, 0, 20).then(([list, hasMsg]) => {
            console.log(list, hasMsg)
            that.historyMsg = list
            that.hasMsg = hasMsg
            that.refreshChatroom()
          })
        }
      }, 500)
    },
    methods: {
      resetChatInfo () {
        let params = {
          userId: this.userId
        }
        getFriendInfo(params).then(data => {
          this.friendInfo = data
        })
      },
      sendMessage () {
        let msg = {
          content: this.replyText.trim(),
          extra: ''
        }
        if (msg.content) {
          sendTextMsg(1, this.userId, msg).then((message) => {
            this.historyMsg.push(message)
            this.replyText = ''
            this.refreshChatroom()
          })
        }
      },
      refreshChatroom () {
        setTimeout(function () {
          let $chatroom = document.getElementById('chatroom')
          $chatroom.scrollTop = $chatroom.scrollHeight
        }, 0)
      },
      fetchHistoryMsg () {

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
          str = moment(timestramp).format('Y-M-D HH:mm')
        }
        return str
      }
    },
    watch: {
      userId (val) {
        this.resetChatInfo()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-container {
    background-color: #f9fbfd;
    overflow: hidden;
  }
  .el-header {
    text-align: center;
    background-color: #fff;
    box-shadow: 2px 2px 2px #f5f7fa;
    z-index: 1;
    .title {
      font-weight: 400;
      line-height: 60px;
      margin: 0;
    }
  }
  .el-main {
    overflow-y: auto;
  }
  .message-block {
    .message-list {
      list-style: none;
      padding-left: 5px;
      .message-item {
        margin-bottom: 20px;
      }
    }
  }

  .msg-date {
    margin: 5px 0;
    text-align: center;
    color: #aaa;
    font-size: 14px;
  }

  .msg-card {
    display: flex;
    align-items: flex-start;
    justify-content: start;

    .face {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      flex: 1;
    }
  }

  .el-footer {
    background-color: #fff;
    .input-box {
      height: 100%;
      .message-form {
        display: flex;
        align-items: center;
        justify-content: start;
        height: 100%;
        padding: 5px;
        .text-area {
          min-height: 70px;
          flex: 1;
          outline: none;
          border: 1px solid #eee;
          border-radius: 2px;
          padding: 5px;
        }
        .btn-send {
          margin-left: 5px;
        }
      }
    }
  }

  pre[contenteditable]:empty:not(:focus):before {
    content: attr(placeholder);
    color: #aaa;
  }
</style>
