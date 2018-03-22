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

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  }

</style>
