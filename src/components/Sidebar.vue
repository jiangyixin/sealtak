<template>
  <el-aside width="70px" class="toolbar">
    <router-link :to="{name: 'Index'}" class="bar-item">
      <icon name="weixin"></icon>
    </router-link>
    <router-link :to="{name: 'Info'}" class="bar-item">
      <icon name="address-book-o"></icon>
    </router-link>
  </el-aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {

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
      &.router-link-exact-active {
        background-color: #2884ca;
      }
    }
  }

  .el-menu--collapse {
    width: 70px;
  }

</style>
