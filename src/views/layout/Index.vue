<template>
  <el-container>
    <el-aside></el-aside>
    <contacts></contacts>
    <el-main>

    </el-main>
  </el-container>
</template>

<script>
  import Contacts from '../../components/contacts/Index.vue'
  export default {
    name: 'Info',
    components: {
      Contacts
    },
    data () {
      return {}
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

</style>
