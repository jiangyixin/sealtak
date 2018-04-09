<template>
  <el-aside width="330px" class="contacts-bar" style="height: 100%;">
    <div>
      <el-row class="tac">
        <el-col :span="24">
          <!--<h5>默认颜色</h5>-->
          <el-menu
            default-active="1"
            class="el-menu-vertical"
            :router="true"
            :default-openeds="openeds"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="1">
              <span slot="title">新消息</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <span>群组</span>
              </template>
              <el-menu-item-group key="group">
                <template v-for="(group, index) in myGroups">
                  <el-menu-item :route="{ name: 'GroupInfo', params: { groupId: group.groupId } }" :key="group.groupId" :index="group.groupId|toString">{{ group.groupName }}</el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <span>联系人</span>
              </template>
              <template v-for="(group, index) in groupFriends">
                <el-menu-item-group :key="group.letter">
                  <template slot="title">{{ group.letter }}</template>
                  <template v-for="(friend, index) in group.data">
                    <el-menu-item :route="{ name: 'UserInfo', params: { userId: friend.friendUserId } }" :key="friend.friendUserId" :index="friend.friendUserId|toString">{{ friend.nickname }}</el-menu-item>
                  </template>
                </el-menu-item-group>
              </template>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </el-aside>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Contacts',
    data () {
      return {
        openeds: ['1', '2', '3']
      }
    },
    computed: {
      ...mapGetters(['groupFriends', 'myGroups'])
    },
    filters: {
      toString (val = '') {
        return val.toString()
      }
    },
    created () {
      this.$store.dispatch('getMyFriends', {applyStatus: 'passed'}).then(resp => {

      })
      this.$store.dispatch('getMyGroups').then(resp => {

      })
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .contacts-bar {
    background-color: #f5f8fc;
  }

</style>
