<template>
  <el-container id="app">
    <Sidebar></Sidebar>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
  import Sidebar from './components/Sidebar.vue'
  export default {
    name: 'App',
    components: {
        Sidebar
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  html, body, .el-container {
    margin: 0;
    height: 100%;
  }

  .el-main {
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  }

  .fa-icon {
    width: auto;
    height: 1em; /* 或任意其它字体大小相对值 */
    /* 要在 Safari 中正常工作，需要再引入如下两行代码 */
    max-width: 100%;
    max-height: 100%;
  }

</style>
