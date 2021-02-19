<template>
  <div>
    <Card>
      <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
      <FormItem label="发布日期">
        <DatePicker v-model="formData.create_date" placeholder="选择值班日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="内容"  prop="content">
        <Input placeholder="值班信息的内容" type="textarea" v-model="formData.content"></Input>
      </FormItem>
      <FormItem label="备注" prop="note">
        <Input type="text" placeholder="备注" v-model="formData.note"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitShortMsg">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
      </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addOndutyMessage } from '@/api/onduty-message'
import { formatDate } from '@/libs/util'
export default {
  name: 'shortmsg-add',
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  data () {
    const validateContent = (r, v, callback) => {
      if (v === '') { callback(new Error('信息内容不能为空')) } else { callback() }
    }
    return {
      formData: {
        create_date: new Date(),
        content: '',
        note: ''
      },
      ruleForm: {
        content: [{ validator: validateContent, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitShortMsg () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          // 进行添加数据
          const data = {
            user_token: this.userToken,
            create_time: formatDate(this.formData.create_date),
            content: this.formData.content,
            note: this.formData.note
          }
          // 网络请求添加信息
          addOndutyMessage(data).then(res => {
            this.$Message.success('添加成功!')
            this.handleReset()
          }).catch(err => {
            if (err.response.status === 422) {
              this.$Modal.error({ title: '错误', content: '数据填写有误,请检查后再添加!' })
            }
          })
        }
      })
    },
    handleReset () {
      this.$refs['formData'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
