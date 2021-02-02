<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <div style="color: #F0F0F0;font-size:24px;font-family:华文隶书">工作管理系统 <span style="font-size:15px">2.0.1</span></div>
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
<!--          <p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getSystemUsers',
      'getAllVarieties'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(() => {
        this.getUserInfo().then(() => {
          this.getSystemUsers().then(() => {
            this.getAllVarieties().then(() => {
              this.$router.push({
                name: this.$config.homeName
              })
            })
          })
        })
      }, (err) => {
        if (err.response.status) {
          this.$Modal.error({ title: '错误', content: '用户名或密码错误!' })
        } else {
          this.$Modal.error({ title: '错误', content: '其他未知错误!' })
        }
      }).catch(err => {
        const errorData = err.response.data
        this.$Message.error(errorData.detail)
      })
    }
  }
}
</script>

<style>

</style>
