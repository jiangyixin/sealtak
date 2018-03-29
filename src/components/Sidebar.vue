<template>
  <el-aside width="70px" class="toolbar" style="height: 100%; float: left;">
    <div @click="toggleSidebar('Conversations')" class="bar-item" :class="[curSidebar == 'Conversations' ? 'active' : '']">
      <icon name="weixin"></icon>
    </div>
    <div @click="toggleSidebar('Contacts')" class="bar-item" :class="[curSidebar == 'Contacts' ? 'active' : '']">
      <icon name="address-book-o"></icon>
    </div>
  </el-aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Sidebar',
    computed: {
      ...mapGetters(['curSidebar'])
    },
    data () {
      return {

      }
    },
    methods: {
      toggleSidebar (curSidebar) {
        this.$store.commit('SET_CUR_SIDEBAR', curSidebar)
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .toolbar {
    background-color: #38a0fe;
    .bar-item {
      display: block;
      color: #fff;
      font-size: 24px;
      text-align: center;
      height: 70px;
      line-height: 75px;
      &.active {
        background-color: #2884ca;
      }
    }
  }

  .el-menu--collapse {
    width: 70px;
  }

</style>
