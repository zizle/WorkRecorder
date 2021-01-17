<template>
<div>
  <Tabs>
    <TabPane label="权益记录">
      <Card>
        <Form ref="newIndex" :label-width="80" :model="newIndexData" :rules="newIndexRules">
          <FormItem label="记录日期" prop="create_time">
            <DatePicker v-model="newIndexData.create_date" placeholder="选择记录的日期" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem label="选择客户" prop="customer_id">
            <Select filterable clearable v-model="newIndexData.customer_id" placeholder="选择为哪个客户添加权益记录,若需新增,请点击新增选项卡">
              <Option v-for="item in userCustomerList" :key="item.id" :value="item.id">{{ item.customer_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="留存" prop="remain">
            <Input type="number" placeholder="录入客户的留存数,默认为0" v-model="newIndexData.remain"></Input>
          </FormItem>
          <FormItem label="利息" prop="interest">
            <Input type="number" placeholder="录入客户的利息,默认为0" v-model="newIndexData.interest"></Input>
          </FormItem>
          <FormItem label="权益" prop="crights">
            <Input type="number" placeholder="录入客户的权益数,默认为0" v-model="newIndexData.crights"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" size="small" @click="handleSubmitNewIndex" :loading="addLoading">确定记录</Button>
            <Button style="margin-left: 8px" size="small" @click="handleResetNewIndex">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </TabPane>
    <TabPane label="新增客户">
      <Card>
        <Form ref="newCustomer" :label-width="80" :model="newCustomerData" :rules="newCustomerRules">
          <FormItem label="客户名称" prop="customer_name">
            <Input type="text" placeholder="输入客户的名称" v-model="newCustomerData.customer_name"></Input>
          </FormItem>
          <FormItem label="客户账号" prop="customer_account">
            <Input type="text" placeholder="输入客户的账号" v-model="newCustomerData.customer_account"></Input>
          </FormItem>
          <FormItem label="备注" prop="customer_note">
            <Input type="text" placeholder="其他信息" v-model="newCustomerData.customer_note"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" size="small" @click="handleSubmitNewCustomer" :loading="addLoading">确定提交</Button>
            <Button style="margin-left: 8px" size="small" @click="handleResetNewCustomer">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </TabPane>
  </Tabs>
</div>
</template>
<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { addNewCustomer, getUserCustomer, addNewCustomerIndex } from '@/api/income-point'
export default {
  name: 'income-add',
  data () {
    const validateCustomerName = (r, v, callback) => {
      if (v === '') { callback(new Error('客户名称不能为空')) } else (callback())
    }
    const validateCustomerAccount = (r, v, callback) => {
      if (v === '') { callback(new Error('客户账号不能为空')) } else (callback())
    }
    const validateIndexCurId = (r, v, callback) => {
      if (v === '') { callback(new Error('需选择一个客户')) } else (callback())
    }
    const validateIndexRemain = (r, v, callback) => {
      if (v === '') { this.newIndexData.remain = 0 } else (callback())
    }
    const validateIndexInterest = (r, v, callback) => {
      if (v === '') { this.newIndexData.interest = 0 } else (callback())
    }
    const validateIndexCrights = (r, v, callback) => {
      if (v === '') { this.newIndexData.crights = 0 } else (callback())
    }

    return {
      userCustomerList: [],
      addLoading: false,
      newCustomerData: {
        customer_name: '',
        customer_account: '',
        customer_note: ''
      },
      newCustomerRules: {
        customer_name: [{ validator: validateCustomerName, trigger: 'blur' }],
        customer_account: [{ validator: validateCustomerAccount, trigger: 'blur' }]
      },

      newIndexData: {
        create_date: new Date(),
        customer_id: '',
        remain: '',
        interest: '',
        crights: ''
      },
      newIndexRules: {
        customer_id: [{ validator: validateIndexCurId, trigger: 'blur' }],
        remain: [{ validator: validateIndexRemain, trigger: 'blur' }],
        interest: [{ validator: validateIndexInterest, trigger: 'blur' }],
        crights: [{ validator: validateIndexCrights, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  mounted () {
    // 初始化记录日期
    const curDate = new Date()
    let y = curDate.getFullYear()
    let m = curDate.getMonth()
    if (m === 1) {
      y = y - 1
      m = 12
    } else {
      m = m - 1
    }
    this.newIndexData.create_date = new Date(y, m, 0)

    this.getCurUserCustomers()
  },
  methods: {
    // 获取当前用户的所有客户
    getCurUserCustomers () {
      getUserCustomer(this.userToken).then(res => {
        this.userCustomerList = res.data.customers
      }).catch(() => { this.$Message.error('获取客户列表失败!') })
    },

    // 添加新记录
    handleSubmitNewIndex () {
      this.$refs['newIndex'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          const reqData = {
            user_token: this.userToken,
            customer_id: this.newIndexData.customer_id,
            create_time: formatDate(this.newIndexData.create_date),
            remain: this.newIndexData.remain,
            interest: this.newIndexData.interest,
            crights: this.newIndexData.crights
          }
          addNewCustomerIndex(reqData).then(res => {
            this.$Message.success('添加记录成功!')
            this.handleResetNewIndex()
            this.addLoading = false
          }).catch((err) => {
            if (err.response.status === 403) {
              this.$Modal.error({
                title: '错误',
                content: err.response.data.detail
              })
            }
            this.$Message.error('添加失败！')
            this.addLoading = false
          })
        }
      })
    },
    // 添加新客户
    handleSubmitNewCustomer () {
      this.$refs['newCustomer'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          const reqData = {
            user_token: this.userToken,
            customer_name: this.newCustomerData.customer_name,
            account: this.newCustomerData.customer_account,
            note: this.newCustomerData.customer_note
          }
          addNewCustomer(reqData).then(res => {
            console.log(res)
            this.$Message.success('添加成功!')
            this.handleResetNewCustomer()
            this.userCustomerList = res.data.customers
            this.addLoading = false
          }).catch(() => {
            this.$Message.error('添加失败了!')
            this.addLoading = false
          })
        }
      })
    },
    handleResetNewCustomer () {
      this.$refs['newCustomer'].resetFields()
    },
    handleResetNewIndex () {
      this.$refs['newIndex'].resetFields()
    }

  }
}
</script>

<style scoped>

</style>
