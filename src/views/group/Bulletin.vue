<template>
  <el-container>
    <el-header>
      <el-button class="btn-left" icon="el-icon-arrow-left" @click="back()"></el-button>
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
          <el-button @click="sendToAll" :disabled="(!hasBulletin || !canEdit)">发布</el-button>
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
        bulletin: '',
        groupInfo: {},
        myGroupSetting: {}
      }
    },
    computed: {
      hasBulletin () {
        return !!this.bulletin.trim()
      },
      canEdit () {
        let canEdit = false
        if (this.groupInfo.groupType == 'class' || this.groupInfo.groupType == 'committee') {
          if (['teacher', 'tutor', 'monitor'].indexOf(this.myGroupSetting.role) > -1) {
            canEdit = true
          }
        } else if (this.groupInfo.groupType == 'group') {
          if (['teacher', 'tutor', 'monitor', 'groupHead'].indexOf(this.myGroupSetting.role) > -1) {
            canEdit = true
          }
        } else if (this.groupInfo.groupType == 'free') {
          if (['teacher', 'tutor'].indexOf(this.myGroupSetting.role) > -1) {
            canEdit = true
          }
        }
        return canEdit
      }
    },
    created () {
      this.$store.dispatch('getGroupInfo', this.groupId).then(data => {
        this.groupInfo = data
        this.bulletin = data.notice
      })
      this.$store.dispatch('getMyGroupSetting', this.groupId).then(data => {
        this.myGroupSetting = data
      })
    },
    methods: {
      sendToAll () {
        this.$confirm('该公告会通知全部群成员，是否发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let form = {
            groupId: this.groupId,
            notice: this.bulletin
          }
          this.$store.dispatch('updateGroupSetting', form).then(data => {
            let mentioneds = new RongIMLib.MentionedInfo()
            mentioneds.type = RongIMLib.MentionedType.ALL
            mentioneds.userIdList = []
            let conversation = {
              conversationType: 3,
              targetId: this.groupId + '',
              message: {
                content: '@所有人 ' + this.bulletin.trim(),
                extra: '',
                mentionedInfo: mentioneds
              },
              at: true
            }
            this.$store.dispatch('sendTextMsg', conversation).then(data => {
              console.log(data)
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
            }).catch(err => {
              console.log(err)
            })
          })
        })
      },
      back () {
        history.back()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-header {
    position: relative;
    text-align: center;
    background-color: #fff;
    box-shadow: 2px 2px 2px #f5f7fa;
    z-index: 1;
    .btn-left {
      position: absolute;
      left: 0;
      top: 0;
      height: 60px;
      font-size: 25px;
      border: none;
    }
  }
  .bulletin-form {
    padding: 50px;
  }
  .text-right {
    text-align: right;
    padding-top: 15px;
  }
</style>
