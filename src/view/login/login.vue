<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <div style="color: #F0F0F0;font-size:24px;font-family:华文隶书">工作管理系统2.0</div>
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
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
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
