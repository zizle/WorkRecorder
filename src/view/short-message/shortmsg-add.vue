<template>
<!--  <div style="text-align: center;font-size: 15px;color: #ed4014">【手动添加短讯通】功能未上线</div>-->
  <div>
    <Card>
      <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
      <FormItem label="发布日期">
        <DatePicker v-model="formData.create_date" placeholder="选择短讯通发布的日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="内容"  prop="content">
        <Input placeholder="短讯通的内容" type="textarea" v-model="formData.content"></Input>
      </FormItem>
      <FormItem label="类别"  prop="msg_type">
        <Input placeholder="短讯通的类别" type="text" v-model="formData.msg_type"></Input>
      </FormItem>
      <FormItem label="影响品种" prop="effects">
        <Input type="text" placeholder="影响品种" v-model="formData.effects"></Input>
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
import { addShortMessage } from '@/api/short-message'
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
      if (v === '') { callback(new Error('短讯内容不能为空')) } else { callback() }
    }
    return {
      formData: {
        create_date: new Date(),
        content: '',
        msg_type: '',
        effects: '',
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
            msg_type: this.formData.msg_type,
            effects: this.formData.effects,
            note: this.formData.note
          }
          // 网络请求添加信息
          addShortMessage(data).then(res => {
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
