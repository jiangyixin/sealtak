<template>
  <el-container>
    <el-header>
      <el-button class="btn-left" icon="el-icon-arrow-left" @click="back()"></el-button>
      <h3>添加好友</h3>
    </el-header>
    <el-main>
      <div class="search-form">
        <el-input placeholder="请输入" v-model="keyword" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="学号" value="studentid"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'SearchFriend',
    props: [

    ],
    data () {
      return {
        keyword: '',
        select: 'studentid'
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    created () {

    },
    watch: {
      keyword (val, oldVal) {

      }
    },
    methods: {
      submit () {
        this.$confirm('确认发送好友请求？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let form = {
            friendUserId: this.friendUserId,
            applyReason: this.applyReason.trim() || this.placeholder,
            remark: this.remark,
            applyFrom: this.applyFrom,
            fromRemark: this.fromRemark
          }
          this.$store.dispatch('applyFriend', form).then(data => {
            console.log(data)
            this.$message({
              type: 'success',
              message: '发送成功!'
            })
            this.$router.replace({name: 'UserInfo', params: {userId: this.friendUserId}, query: {applyFrom: this.applyFrom, fromRemark: this.fromRemark}})
          }).catch(error => {
            console.log(error)
          })

        }).catch(() => {

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
  .search-form {
    padding: 50px;
    .el-select /deep/ .el-input {
      width: 100px;
    }
  }

</style>
