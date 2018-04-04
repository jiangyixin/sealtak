<template>
  <div class="emojo-box">
    <template v-for="(emojo, index) in emojoList">
      <span v-html="symbolToHTML(emojo.symbol)"></span>
    </template>
  </div>
</template>

<script>

  export default {
    name: 'Emoji',
    props: {

    },
    data () {
      return {
        emojoList: {}
      }
    },
    created () {
      this.emojoList = RongIMLib.RongIMEmoji.list
    },
    methods: {
      symbolToHTML (symbol) {
        if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.symbolToHTML) {
          return RongIMLib.RongIMEmoji.symbolToHTML(symbol)
        }
      }
    },
    filters: {
//      emojoToHtml (emojo) {
//        if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
//          return RongIMLib.RongIMEmoji.emojiToHTML(emojo)
//        } else {
//          return emojo
//        }
//      },

    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .emojo-box {
    position: absolute;
    background-color: #fff;
    bottom: 38px;
    width: 388px;
    padding: 5px;
    border: 1px solid #D9DADC;
    z-index: 1000;
    border-radius: 4px;
  }

</style>
