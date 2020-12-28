<template>
    <div class="add-form">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="用户名" prop="username">
            <Input type="text" v-model="formCustom.username"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
            <Input type="text" v-model="formCustom.phone"></Input>
        </FormItem>
        <FormItem label="部门小组" prop="organization">
            <Select v-model="formCustom.organization" placeholder="选择部门小组">
                <Option :value=1>宏观金融</Option>
                <Option :value=2>化工小组</Option>
                <Option :value=3>农产品组</Option>
                <Option :value=4>金属小组</Option>
                <Option :value=5>创新部门</Option>
                <Option :value=0>其他</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
    </div>
</template>

<script>
export default {
  name: 'user-add',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户的手机号'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        username: '',
        phone: '',
        organization: 0
      },
      ruleCustom: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 发送请求创建用户
          this.$Message.success('Success!')
        } else {
          this.$Message.error('请输入用户名和手机号!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }

}
</script>

<style scoped>
  .add-form{
    width: 50%;
    margin: 0 auto;
  }

</style>
