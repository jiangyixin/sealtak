<template>
  <el-container>
    <el-header>
      <h3 class="title">{{ chatInfo.title }}</h3>
    </el-header>
    <el-main id="chatroom">
      <div class="message-block">
        <ul class="message-list">
          <li v-for="(msg, index) in curConversation.histories" :key="index" class="message-item">
            <div class="msg-date">{{ msg.sentTime|humanizeTime(curConversation.histories[index-1] && curConversation.histories[index-1].sentTime) }}</div>
            <Message v-if="chatMembers[msg.senderUserId]" :rcMessage="msg" :owner="chatMembers[msg.senderUserId]"></Message>
          </li>
        </ul>
      </div>
    </el-main>
    <el-footer height="130px">
      <div class="input-box">
        <div class="operate-row">
          <div class="operate-item">
            <icon name="meh-o" v-popover:popover4></icon>
            <emojo v-model="showEmojo"></emojo>
            <el-popover
              ref="popover4"
              placement="right"
              width="400"
              trigger="click">
              <el-table>
                <el-table-column width="150" property="date" label="日期"></el-table-column>
                <el-table-column width="100" property="name" label="姓名"></el-table-column>
                <el-table-column width="300" property="address" label="地址"></el-table-column>
              </el-table>
            </el-popover>
          </div>
          <div class="operate-item"><icon name="image"></icon></div>
        </div>
        <div class="message-form">
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
  import Emojo from './Emoji.vue'
  import Message from './Message.vue'
  import { mapGetters } from 'vuex'
  import { getFriendInfo } from '../../api/friend'
  import { getGroupMembers } from '../../api/group'
  let moment = require('moment')

  export default {
    name: 'Chat',
    components: {
      Message, Emojo
    },
    props: {
      conversationType: {
        type: Number
      },
      targetId: {
        type: String
      }
    },
    data () {
      return {
        $chatroom: null,
        chatInfo: {
          title: ''
        },
        replyText: '',
        page: {
          first: true,
          timestrap: null,
          limit: 20,
          loading: false
        },
        chatMembers: {},
        showEmojo: true
      }
    },
    computed: {
      ...mapGetters(['initStatus', 'userInfo', 'curConversation'])
    },
    created () {
      this.page.first = true
      let conversation = {
        conversationType: this.conversationType,
        targetId: this.targetId,
        hasMsg: true,
        histories: []
      }
      this.$store.commit('SET_CUR_CONVERSATION', conversation)
      this.fetchChatMembers()
      let that = this
      let initInterval = setInterval(function () {
        if (that.initStatus) {
          clearInterval(initInterval)
          that.fetchLatestMessage()
          that.clearUnreadCount()
        }
      }, 500)
    },
    mounted () {
      this.$chatroom = document.getElementById('chatroom')
      this.$chatroom.addEventListener('scroll', this.fetchHistoricalMessage)
    },
    methods: {
      clearUnreadCount () {
        this.$store.dispatch('clearUnreadCount', this.curConversation).then()
      },
      fetchChatMembers () {
        if (this.conversationType == 1) {
          let params = {
            userId: this.targetId
          }
          this.$store.dispatch('getFriendInfo', params).then(data => {
            this.chatInfo.title = data.nickname
            this.$set(this.chatMembers, this.targetId, {
              nickname: data.nickname,
              headimgurl: data.headimgurl,
              userId: data.userId
            })
          })
        } else if (this.conversationType == 3) {
          this.$store.dispatch('getGroupInfo', this.targetId).then(data => {
            this.chatInfo.title = data.groupName
          })
          this.$store.dispatch('getGroupMembers', this.targetId).then(data => {
            for (let member of data) {
              this.$set(this.chatMembers, member.userId, {
                userId: member.userId,
                nickname: member.nickname,
                headimgurl: member.headimgurl
              })
            }
          })
        }
        this.$store.dispatch('getUserProfile').then(data => {
          this.$set(this.chatMembers, data.userId, {
            userId: data.userId,
            nickname: data.nickname,
            headimgurl: data.headimgurl
          })
        })
      },
      sendMessage () {
        let conversation = {
          conversationType: this.curConversation.conversationType,
          targetId: this.curConversation.targetId,
          message: {
            content: this.replyText.trim(),
            extra: ''
          },
          at: false
        }

        if (conversation.message.content) {
          this.$store.dispatch('sendMsg', conversation).then(data => {
            this.replyText = ''
            this.refreshChatroom()
          })
        }
      },
      refreshChatroom () {
        let that = this
        setTimeout(function () {
          that.$chatroom.scrollTop = that.$chatroom.scrollHeight
        }, 0)
      },
      fetchLatestMessage () {
        this.$store.dispatch('getHistoryMsg', this.page).then((data) => {
          this.page.first = false
          this.refreshChatroom()
        })
      },
      fetchHistoricalMessage (e) {
        if (e.target.scrollTop <= 10 && !this.page.first && !this.page.loading && this.curConversation.hasMsg) {
          console.log('---fetchHistoricalMessage---')
          this.page.first = false
          this.page.loading = true
          let curHeight = this.$chatroom.scrollHeight
          let that = this
          this.$store.dispatch('getHistoryMsg', this.page).then(data => {
            setTimeout(function () {
              that.page.loading = false
            }, 500)
            this.$chatroom.scrollTop = this.$chatroom.scrollHeight - curHeight
          })
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
          str = moment(timestramp).format('Y-M-D HH:mm')
        }
        return str
      }
    },
    watch: {
      targetId (val) {
        this.page.first = true
        let conversation = {
          conversationType: this.conversationType,
          targetId: this.targetId,
          hasMsg: true,
          histories: []
        }
        this.$store.commit('SET_CUR_CONVERSATION', conversation)
        this.fetchChatMembers()
        this.fetchLatestMessage()
        this.clearUnreadCount()
      },
      'curConversation.newMsg': function (val, oldVal) {
        this.refreshChatroom()
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

  .el-footer {
    background-color: #fff;
    .input-box {
      height: 100%;
      .operate-row {
        padding: 10px 5px 0;
        color: #c7c7c7;
        .operate-item {
          position: relative;
          display: inline-block;
          font-size: 20px;
          cursor: pointer;
          &+.operate-item {
            margin-left: 10px;
          }
          &:hover, &:focus, &:active {
            color: #38a0fe;
          }
        }
      }
      .message-form {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0 5px;
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
