<template>
  <div>
    <Row>
      <i-col span="14">
        <Card>
          <div class="cropper-example cropper-first">
            <cropper
              :src="exampleImageSrc"
              crop-button-text="确认提交"
              @on-crop="handleCroped"
            ></cropper>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Cropper from '@/components/cropper'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'cropper_page',
  components: {
    Cropper
  },
  data () {
    return {
      exampleImageSrc: ''
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  methods: {
    ...mapActions([
      'uploadUserAvatar'
    ]),
    handleCroped (blob) {
      const imgName = new Date().toLocaleTimeString() + '.png'
      const imgFile = new File([blob], imgName, { type: 'image/png' })
      this.uploadUserAvatar({ file: imgFile }).then(() => {
        this.$Message.success('设置成功!')
      })
    }
  }
}
</script>

<style lang="less">
.cropper-example{
  height: 400px;
}
</style>
