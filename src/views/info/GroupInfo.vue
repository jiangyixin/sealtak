<template>
  <el-container>
    <el-header>
      <el-button class="btn-left" icon="el-icon-arrow-left" @click="back()"></el-button>
      <h3 class="title">群资料</h3>
    </el-header>
    <el-main>
      <div class="user-info">
        <div class="group-data">
          <div class="photo">
            <img :src="groupInfo.groupHeadimgurl" alt="">
          </div>
          <div class="info">
            <h3 class="name">{{ groupInfo.groupName }}</h3>
            <p class="num">群成员 {{ groupInfo.num }} 人</p>
          </div>
        </div>
      </div>
      <div class="operate-block">
        <el-button type="text" @click="toChat()">发群聊</el-button>
      </div>
      <div class="operate-block">
        <el-button type="text" @click="toBulletin()">群公告</el-button>
      </div>
      <ul class="group-member-list">
        <li v-for="(member, index) in groupMembers" :key="member.userId" class="group-member-item">
          <router-link :to="{name: 'UserInfo', params: {userId: member.userId, applyFrom: 'group', fromRemark: groupId}}" class="member-card">
            <div class="face"><img :src="member.headimgurl" alt=""></div>
            <div class="info">
              <div class="name">{{ member.nickname }}</div>
            </div>
          </router-link>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script>

  export default {
    name: 'GroupInfo',
    components: {

    },
    props: ['groupId'],
    data () {
      return {
        conversationType: '3',
        groupInfo: {},
        groupMembers: []
      }
    },
    created () {
      this.fetchGroupInfo()
    },
    methods: {
      fetchGroupInfo () {
        this.$store.dispatch('getGroupInfo', this.groupId).then(data => {
          this.groupInfo = data
        })
        this.$store.dispatch('getGroupMembers', this.groupId).then(data => {
          this.groupMembers = data
        })
      },
      toChat () {
        this.$router.push({name: 'Chat', params: {conversationType: this.conversationType, targetId: this.groupId}})
      },
      toBulletin () {
        this.$router.push({name: 'Bulletin', params: { groupId: this.groupId }})
      },
      back () {
        history.back()
      }
    },
    watch: {
      groupId () {
        this.fetchGroupInfo()
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .el-container {
    background-color: #f9fbfd;
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
  }
  .el-main {

  }
  .user-info {
    padding: 20px 100px;
    .group-data {
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
        .name {
          margin: 10px 0 10px 0;
        }
        .num {
          font-size: 14px;
          color: #95989a;
        }
      }
    }
  }

  .operate-block {
    margin: 15px 100px;
    border-bottom: 1px solid #e9f0f8;
  }

  .group-member-list {
    margin: 20px 100px;
    list-style: none;
    padding-left: 0;

    .member-card {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-bottom: 10px;
      cursor: pointer;
      text-decoration: inherit;
      color: inherit;
      .face {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        flex: 1;
        height: 36px;
        line-height: 36px;
        border-bottom: 1px solid #e9f0f8;
        .name {

        }
      }
    }
  }

</style>
