<template>
  <el-container>
    <el-header>
      <h3 class="title">好友信息</h3>
    </el-header>
    <el-main>
      <div class="user-info">
        <div class="user-data">
          <div class="photo">
            <img :src="userInfo.headimgurl" alt="">
          </div>
          <div class="info">
            <h3 class="username">{{ userInfo.nickname }}</h3>
            <p class="studentid">{{ userInfo.studentid }}</p>
          </div>
        </div>
      </div>
      <div class="operate-block">
        <el-button type="text" @click="toChat()">发消息</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>

  export default {
    name: 'UserInfo',
    components: {

    },
    props: ['userId'],
    data () {
      return {
        conversationType: '1',
        userInfo: {}
      }
    },
    created () {
      this.fetchUserInfo()
    },
    methods: {
      fetchUserInfo () {
        let params = {
          userId: this.userId
        }
        this.$store.dispatch('getFriendInfo', params).then(data => {
          this.userInfo = data
        })
      },
      toChat () {
        this.$router.push({name: 'Chat', params: {conversationType: this.conversationType, targetId: this.userId}})
      }
    },
    watch: {
      userId (val) {
        this.fetchUserInfo()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-container {
    background-color: #f9fbfd;
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

  }
  .user-info {
    padding: 20px 100px;
    .user-data {
      display: flex;
      align-items: center;
      justify-content: start;
      .photo {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        margin-left: 10px;
        .username {
          margin: 10px 0 10px 0;
        }
        .studentid {
          font-size: 14px;
          color: #95989a;
        }
      }
    }
  }
  .operate-block {
    padding: 20px 100px;
  }
</style>
