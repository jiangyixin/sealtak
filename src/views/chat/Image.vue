<template>
  <div class="choice-block">
    <input @change="uploadToQiniu" class="choice-image" type="file" accept="image/*">
    <icon name="image"></icon>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getQiniuToken } from '../../api/qiniu'
  import axios from 'axios'
  const lrz = require('lrz')

  export default {
    name: 'RcImage',
    props: {

    },
    computed: {
      ...mapGetters(['userId'])
    },
    data () {
      return {
        percentage: 0,
        image: {
          key: '',
          content: '',
          imageUri: ''
        }
      }
    },
    created () {

    },
    methods: {
      uploadToQiniu (e) {
        let file = e.target.files[0]
        if (file) {
          lrz(file).then(ret => {
            let param = new FormData()
            param.append('file', ret.file, file.name)
            getQiniuToken().then(data => {
              param.append('token', data.token)
              param.append('key', `sealtalk/${this.userId}/${file.name}`)
              let config = {
                headers:{'Content-Type':'multipart/form-data'}
              }
              axios.post('https://upload.qiniu.com/', param, config).then(resp => {
                console.log('-----上传图片成功---', resp)
                this.image.key = resp.data.key
                this.image.imageUri = resp.data.url
                this.image.content = ret.base64.replace('data:image/jpeg;base64,', '')
                this.$emit('execCommandImage', this.image)
              }).catch(err => {
                console.log('-----上传图片失败---', err)
              })
            }).catch(err => {
              console.log('获取token失败', err)
            })
          }).catch(err => {
            console.log('压缩图片失败', err)
          })
        }
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">

  .progress-row {
    position: absolute;
    padding: 0 15px 5px 2px;
    top: -20px;
    right: 45px;
    left: 22px;
  }
  .choice-block {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .choice-image {
      position: absolute;
      display: inline-block;
      font-size: 100px;
      width: 20px;
      height: 20px;
      opacity: 0;
      cursor: pointer;
    }
  }


</style>
