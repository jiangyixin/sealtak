<template>
  <el-container>
    <el-header>
      <el-button class="btn-left" icon="el-icon-arrow-left" @click="back()"></el-button>
      <h3 class="title">{{ chatInfo.title }}</h3>
      <el-button class="btn-right" icon="el-icon-info" @click="toInfo()"></el-button>
    </el-header>
    <el-main id="chatroom">
      <div class="message-block">
        <ul class="message-list">
          <li v-for="(msg, index) in curConversation.histories" :key="index" class="message-item">
            <div class="msg-date">{{ msg.sentTime|humanizeTime(curConversation.histories[index-1] && curConversation.histories[index-1].sentTime) }}</div>
            <Message :rcMessage="msg" :owner="chatMembers[msg.senderUserId] || {}" :isMe="msg.senderUserId == userId ? true : false" v-on:showDialogImage="showDialogImage"></Message>
          </li>
        </ul>
      </div>
    </el-main>
    <el-footer height="130px">
      <div class="input-box">
        <div class="operate-row">
          <a @click="toggleShowEmojo" class="operate-item">
            <icon name="meh-o"></icon>
            <emojo v-model="showEmojo" v-on:execCommandEmojo="execCommandEmojo" @update:value="val => showEmojo = val"></emojo>
          </a>
          <div class="operate-item">
            <rc-image v-on:execCommandImage="sendImageMessage"></rc-image>
          </div>
        </div>
        <div class="message-form">
          <el-input
            id="replyText"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            placeholder="请输入内容"
            @keyup.ctrl.enter.native="sendMessage"
            resize="none"
            v-model="replyText">
          </el-input>
          <el-button class="btn-send" type="primary" @click="sendMessage">发送<br>ctrl+enter</el-button>
        </div>
      </div>
    </el-footer>
    <el-dialog :visible.sync="previewDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-container>
</template>

<script>
  import Emojo from './Emoji.vue'
  import RcImage from './Image.vue'
  import Message from './Message.vue'
  import { mapGetters } from 'vuex'
  let moment = require('moment')
  import cache from '../../utils/sessionStorage'
  import $ from 'jquery'
  import '../../assets/lib/caret/jquery.caret.min'
  import '../../assets/lib/at/js/jquery.atwho.min'

  export default {
    name: 'Chat',
    components: {
      Message, Emojo, RcImage
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
        $replyText: null,
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
        showEmojo: false,
        previewDialogVisible: false,
        dialogImageUrl: '',
        chatNicknames: []
      }
    },
    computed: {
      ...mapGetters(['initStatus', 'userInfo', 'curConversation', 'userId']),
      draft () {
        let key = 'draft-' + this.conversationType + '-' + this.targetId
        return cache.get(key) || ''
      }
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
      this.$replyText = document.getElementById('replyText')
      this.replyText = this.draft
    },
    beforeRouteUpdate (to, from, next) {
      if (this.replyText) {
        let key = 'draft-' + this.conversationType + '-' + this.targetId
        cache.set(key, this.replyText)
        this.replyText = ''
      }
      next()
    },
    beforeRouteLeave (to, from, next) {
      if (this.replyText) {
        let key = 'draft-' + this.conversationType + '-' + this.targetId
        cache.set(key, this.replyText)
        this.replyText = ''
      }
      next()
    },
    methods: {
      back () {
        history.back()
      },
      showDialogImage (imgUrl) {
        this.dialogImageUrl = imgUrl
        this.previewDialogVisible = true
      },
      toInfo () {
        if (this.conversationType == 1) {
          this.$router.push({name: 'UserInfo', params: {userId: this.targetId}})
        } else if (this.conversationType == 3) {
          this.$router.push({name: 'GroupInfo', params: { groupId: this.targetId } })
        }
      },
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
              if (this.userId != member.userId) {
                this.chatNicknames.push(member.nickname)
              }
            }
            this.initAt(this.chatNicknames)
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
      initAt (data) {
        $('#replyText').atwho({
          at: "@",
          limit: 3000,
          data: data
        })
      },
      symbolToEmoji (symbol) {
        if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.symbolToEmoji) {
          return RongIMLib.RongIMEmoji.symbolToEmoji(symbol)
        } else {
          return symbol
        }
      },
      getAtArray(item){
        let atArr = item.match(/@.*?\s/g)
        let atMember = []
        for (let at of atArr) {
          let name = at.replace('@', '').replace(' ', '')

        }
        return atMember;
      },
      sendMessage () {
        let conversation = {
          conversationType: this.curConversation.conversationType,
          targetId: this.curConversation.targetId,
          message: {
            content: this.symbolToEmoji(this.replyText.trim()),
            extra: ''
          },
          at: false
        }

        if (conversation.message.content) {
          this.$store.dispatch('sendTextMsg', conversation).then(data => {
            this.replyText = ''
            let key = 'draft-' + this.conversationType + '-' + this.targetId
            cache.set(key, this.replyText)
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
      },
      toggleShowEmojo () {
        this.showEmojo = !this.showEmojo
      },
      execCommandEmojo (symbol) {
        this.$replyText.focus()
        document.execCommand('insertText', 'false', symbol)
      },
      sendImageMessage (image) {
        let conversation = {
          conversationType: this.curConversation.conversationType,
          targetId: this.curConversation.targetId,
          message: {
            content: image.content,
            uri: image.uri,
            extra: ''
          },
          at: false
        }
        this.$store.dispatch('sendImageMsg', conversation).then(data => {
          console.log(data)
          this.refreshChatroom()
        })
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
      targetId (val, oldVal) {
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
        this.replyText = this.draft
      },
      'curConversation.newMsg': function (val, oldVal) {
        this.refreshChatroom()
      }
    }
  }
</script>
<style>
  @import "../../assets/lib/at/css/jquery.atwho.min.css";
</style>
<style scoped rel="stylesheet/scss" lang="scss">

  .el-container {
    background-color: #f9fbfd;
    overflow: hidden;
  }
  .el-header {
    position: relative;
    text-align: center;
    background-color: #fff;
    box-shadow: 2px 2px 2px #f5f7fa;
    z-index: 1;
    .title {
      font-weight: 400;
      line-height: 60px;
      margin: 0;
    }
    .btn-left {
      position: absolute;
      left: 0;
      top: 0;
      height: 60px;
      font-size: 25px;
      border: none;
    }
    .btn-right {
      position: absolute;
      right: 0;
      top: 0;
      height: 60px;
      font-size: 25px;
      border: none;
    }
  }
  .el-main {
    overflow-y: auto;
  }
  .message-block {
    .message-list {
      list-style: none;
      padding-left: 0;
      .message-item {
        margin: 0 5px 20px 5px;
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
    position: relative;
    background-color: #fff;
    .input-box {
      height: 100%;
      .operate-row {
        padding: 10px 5px 0;
        color: #c7c7c7;
        .operate-item {
          position: relative;
          display: inline-block;
          cursor: pointer;
          font-size: 20px;
          width: 20px;
          height: 20px;
          text-align: center;
          &+.operate-item {
            margin-left: 10px;
          }
          &:hover, &:focus, &:active {
            color: #38a0fe;
          }
        }
      }
      .progress-row {

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
          padding: 15px 10px;
        }
      }
    }
  }

  pre[contenteditable]:empty:not(:focus):before {
    content: attr(placeholder);
    color: #aaa;
  }
</style>
