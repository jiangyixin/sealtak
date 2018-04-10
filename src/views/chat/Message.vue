<template>
  <div class="msg-card" v-if="rcMessage">
    <template v-if="rcMessage.objectName == 'RC:InfoNtf'">
      <div class="info-ntf">{{ rcMessage.content.message }}</div>
    </template>
    <template v-else-if="['RC:TxtMsg', 'RC:ImgMsg', 'RC:VcMsg'].indexOf(rcMessage.objectName) > -1">
      <div class="normal-ntf" :class="{ me: isMe }">
        <div class="face"><img :src="owner.headimgurl" alt=""></div>
        <div class="info">
          <div class="name">{{ owner.nickname }}</div>
          <div class="msg">
            <pre class="text-msg" v-if="rcMessage.objectName == 'RC:TxtMsg'" v-html="handledMessage.html"></pre>
            <img class="img-msg" v-else-if="rcMessage.objectName == 'RC:ImgMsg'" :src="handledMessage.html">
            <div v-else-if="rcMessage.objectName == 'RC:VcMsg'">[语音消息]</div>
            <div v-else="">[其他消息]</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="rcMessage.objectName == 'RC:TypSts'"></template>
    <template v-else="">
      <div>
        {{ rcMessage.objectName }}
      </div>
    </template>
  </div>
</template>

<script>
  let moment = require('moment')

  export default {
    name: 'Message',
    props: {
      rcMessage: {
        type: Object,
        default: {}
      },
      owner: {
        type: Object,
        default: {}
      },
      isMe: {
        type: Boolean
      }
    },
    data () {
      return {
//        message: {}
      }
    },
    computed: {
      handledMessage () {
        let handledMsg = this.rcMessage
        let message = handledMsg.content
        switch (handledMsg.objectName) {
          case 'RC:TxtMsg':
            var content = message.content.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
            if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
              content = RongIMLib.RongIMEmoji.emojiToHTML(content)
            }
            handledMsg.html = content
            break;
          case 'RC:ImgMsg':
            handledMsg.html = 'data:image/png;base64,' + message.content
            break;
          case 'RC:VcMsg':
            handledMsg.html = '[语音]'
            break;
          case 'RC:ImgTextMsg':
            handledMsg.html = '[图文]'
            break;
          case 'RC:LBSMsg':
            handledMsg.html = '[位置]'
            break;
          case 'RC:FileMsg':
            handledMsg.html = '[文件]'
            break;
          case 'RC:CmdNtf':
          case 'RC:ContactNtf':
            handledMsg.html = '[通知消息]'
            break;
          case 'RC:InfoNtf':
            handledMsg.html = message.message
            break;
          case 'RC:GrpNtf':
            handledMsg.html = message.message
            break;
          case 'RC:DizNtf':

            break;
          default:

            break;
        }
        return handledMsg
      }
    },
    created () {

    },
    methods: {

    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .msg-card {
    .info-ntf {
      text-align: center;
      color: #999;
    }
    .normal-ntf {
      display: flex;
      align-items: flex-start;
      justify-content: start;
      &.me {
        flex-direction: row-reverse;
        .info {
          text-align: right;
        }
      }
      .face {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 8px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
        .text-msg {
          font-family: inherit;
          margin: 0;
          white-space: pre;
        }
        .img-msg {
          max-width: 100%;
          max-height: 500px;
        }
      }
    }
  }

</style>
