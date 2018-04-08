<template>
  <el-container>
    <el-header>
      <h3>群公告</h3>
    </el-header>
    <el-main>
      <div class="bulletin-form">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 15 }"
          placeholder="请编辑群公告"
          v-model="bulletin">
        </el-input>
        <div class="text-right">
          <el-button @click="sendToAll" :disabled="disabledButton">发布</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>

  export default {
    name: 'Bulletin',
    props: {
      groupId: {}
    },
    data () {
      return {
        bulletin: ''
      }
    },
    computed: {
      disabledButton () {
        return !this.bulletin.trim()
      }
    },
    methods: {
      sendToAll () {
        this.$confirm('该公告会通知全部群成员，是否发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let conversation = {
            conversationType: 3,
            targetId: this.groupId + '',
            message: {
              content: '@所有人 ' + this.bulletin.trim(),
              extra: ''
            },
            at: true
          }
          this.$store.dispatch('sendTextMsg', conversation).then(data => {
            console.log(data)
            this.$message({
              type: 'success',
              message: '发布成功!'
            })
          }).catch(error => {
            console.log(error)
          })

        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-header {
    text-align: center;
    background-color: #fff;
    box-shadow: 2px 2px 2px #f5f7fa;
    z-index: 1;
  }
  .bulletin-form {
    padding: 50px;
  }
  .text-right {
    text-align: right;
    padding-top: 15px;
  }
</style>
