<template>
  <div class="msg-card" v-if="rcMessage">
    <template v-if="rcMessage.objectName == 'RC:InfoNtf'">
      <div class="info-ntf">{{ rcMessage.content.message }}</div>
    </template>
    <template v-else-if="['RC:TxtMsg', 'RC:ImgMsg', 'RC:VcMsg'].indexOf(rcMessage.objectName) > -1">
      <div class="normal-ntf" :class="{ me: isMe }">
        <div class="face"><img :src="owner.headimgurl" alt=""></div>
        <div class="info">
          <div class="name">{{ owner.groupNickname || owner.nickname }}</div>
          <div class="msg">
            <pre class="text-msg" v-if="rcMessage.objectName == 'RC:TxtMsg'" v-html="handledMessage.html"></pre>
            <img @click="previewImage(handledMessage.html)" class="img-msg" v-else-if="rcMessage.objectName == 'RC:ImgMsg'" :src="handledMessage.html">
            <div v-else-if="rcMessage.objectName == 'RC:VcMsg'">
              <div @click="playVoice(rcMessage)" class="voice-msg">
                <span class="icon" :class="{ playing: isPlayVoice }"></span>
                <span class="duration">{{ rcMessage.content.duration }}'</span>
              </div>
            </div>
            <div v-else="">[其他消息]</div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="rcMessage.objectName == 'RC:TypSts'"></template>
    <template v-else-if="rcMessage.objectName == 'RC:RcCmd'">
      <div class="info-ntf" v-html="handledMessage.html"></div>
    </template>
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
        isPlayVoice: false
      }
    },
    computed: {
      handledMessage () {
        let handledMsg = this.rcMessage
        let message = handledMsg.content
        switch (handledMsg.objectName) {
          case 'RC:TxtMsg':
            let content = message.content.replace(/</gi, '&lt;').replace(/>/gi, '&gt;')
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
          case 'RC:RcCmd':
            handledMsg.html = '消息被撤回'
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
      previewImage (imgUrl) {
        this.$emit('showDialogImage', imgUrl)
      },
      playVoice (rcMessage) {
        this.isPlayVoice = true
        let that = this
        let audioFile = rcMessage.content.content
        let duration = audioFile.length / 1024
        RongIMLib.RongIMVoice.preLoaded(audioFile, function() {
          RongIMLib.RongIMVoice.play(audioFile, duration)
          setTimeout(function () {
            that.isPlayVoice = false
          }, rcMessage.content.duration * 1000)
        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .msg-card {
    .info-ntf {
      text-align: center;
      color: #999;
      font-size: 14px;
    }
    .normal-ntf {
      display: flex;
      align-items: flex-start;
      justify-content: start;
      &.me {
        flex-direction: row-reverse;
        .info {
          text-align: right;
          margin-left: 5px;
          margin-right: 0;
        }
      }
      .face {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 8px;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
        margin-right: 5px;
        .name {
          color: #888;
        }
        .msg {
          .text-msg {
            font-family: inherit;
            margin: 0;
            white-space: pre-wrap;
            word-wrap:break-word;
            word-break:break-all;
          }
          .img-msg {
            max-width: 60%;
            max-height: 300px;
            cursor: pointer;
          }
          .voice-msg {
            display: flex;
            justify-content: space-between;
            background-color: #7cbcff;
            width: 100px;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
            .icon {
              width: 32px;
              height: 32px;
              background-image: url("../../assets/image/yuyin.png");
              background-repeat: no-repeat;
              background-position: -3px 0; // -33
              background-size: auto 100%;
              &.playing {
                animation: voiceplay 2s infinite step-start;
              }
            }
            .duration {
              height: 32px;
              line-height: 32px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }

  @keyframes voiceplay{
    0%, 100%{
      background-position: -3px 0;
    }
    25%{
      background-position: -35px 0;
    }
    50%{
      background-position: -64px 0;
    }
    75%{
      background-position: -91px 0;
    }
  }

</style>
