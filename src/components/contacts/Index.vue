<template>
  <el-aside width="315px" class="contacts-bar">

    <div>
      <el-row class="tac">
        <el-col :span="24">
          <!--<h5>默认颜色</h5>-->
          <el-menu
            default-active="1"
            class="el-menu-vertical"
            :default-openeds="openeds"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="1">
              <span slot="title">新消息</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span slot="title">群组</span>
            </el-menu-item>
            <el-submenu index="3">
              <template slot="title">
                <span>联系人</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组3">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </el-aside>
</template>

<script>
  import { getFriend } from '../../api/friend'
  export default {
    name: 'Contacts',
    data () {
      return {
        openeds: ['1', '2', '3']
      }
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
