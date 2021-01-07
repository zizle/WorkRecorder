<template>
  <div>
    <Card>
      <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
        <FormItem label="创建日期">
          <DatePicker v-model="formData.currentDate" placeholder="选择策略建立的日期" :clearable="false"></DatePicker>
        </FormItem>
        <FormItem label="品种" prop="variety_en">
          <Select filterable clearable v-model="formData.variety_en">
            <Option v-for="item in varietyList" :key="item.id" :value="item.variety_en">{{ item.variety_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合约月份" prop="contract">
          <Input placeholder="录入品种4位数合约月份" type="number" v-model="formData.contract"></Input>
        </FormItem>
        <FormItem label="策略内容" prop="content">
          <Input type="textarea" placeholder="填写策略的内容" v-model="formData.content"></Input>
        </FormItem>
        <FormItem label="策略方向">
          <RadioGroup v-model="formData.direction">
            <Radio label="多头">多头</Radio>
            <Radio label="空头">空头</Radio>
            <Radio label="套利">套利</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手数" prop="hands">
          <Input type="number" placeholder="10万为限的策略手数" v-model="formData.hands"></Input>
        </FormItem>
        <FormItem label="策略开仓" prop="open_price">
          <Input type="number" placeholder="开仓时的价格" v-model="formData.open_price"></Input>
        </FormItem>
        <FormItem label="策略平仓" prop="close_price">
          <Input type="number" placeholder="平仓时的价格" v-model="formData.close_price"></Input>
        </FormItem>
        <FormItem label="结果收益" prop="profit">
          <Input type="number" placeholder="用`+`和`-`表示盈亏" v-model="formData.profit"></Input>
        </FormItem>
        <FormItem label="状态">
          <RadioGroup v-model="formData.is_running">
            <Radio :label=1>运行中</Radio>
            <Radio :label=0>已结束</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="备注">
          <Input type="text" placeholder="备注" v-model="formData.note"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submitStrategy">提交</Button>
            <Button style="margin-left: 8px" @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { addStrategy } from '@/api/strategy'
import { formatDate } from '@/libs/util'
export default {
  name: 'strategy-add',
  data () {
    const validateVarietyEN = (r, v, callback) => {
      if (v === '') { callback(new Error('品种不能为空')) } else { callback() }
    }
    const validateContract = (r, v, callback) => {
      if (v === '') {
        callback(new Error('品种合约月份不能为空'))
      } else if (String(v).length !== 4) { callback(new Error('品种合约月份需为4位数')) } else (callback())
    }
    const validateContent = (r, v, callback) => {
      if (v === '') { callback(new Error('策略内容不能为空')) } else (callback())
    }
    const validateHands = (r, v, callback) => {
      if (v === '') { callback(new Error('手数为必填')) } else (callback())
    }
    const validateOpenPrice = (r, v, callback) => {
      if (v === '') { callback(new Error('策略开仓为必填')) } else (callback())
    }
    const validateClosePrice = (r, v, callback) => {
      if (v === '') { callback(new Error('策略平仓为必填')) } else (callback())
    }
    const validateProfit = (r, v, callback) => {
      if (v === '') { callback(new Error('收益项为必填')) } else (callback())
    }
    return {
      formData: {
        currentDate: new Date(),
        variety_en: '',
        contract: '',
        content: '',
        direction: '多头',
        hands: '',
        open_price: '',
        close_price: '',
        profit: '',
        is_running: 0,
        note: ''
      },
      ruleForm: {
        variety_en: [{ validator: validateVarietyEN, trigger: 'blur' }],
        contract: [{ validator: validateContract, trigger: 'blur' }],
        content: [{ validator: validateContent, trigger: 'blur' }],
        hands: [{ validator: validateHands, trigger: 'blur' }],
        open_price: [{ validator: validateOpenPrice, trigger: 'blur' }],
        close_price: [{ validator: validateClosePrice, trigger: 'blur' }],
        profit: [{ validator: validateProfit, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      varietyList: state => state.variety.varietyList
    })
  },
  mounted () {

  },
  methods: {
    submitStrategy () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          // 进行添加数据
          const data = {
            user_token: this.userToken,
            create_time: formatDate(this.formData.currentDate),
            content: this.formData.content,
            variety_en: this.formData.variety_en,
            contract: this.formData.contract,
            direction: this.formData.direction,
            hands: this.formData.hands,
            open_price: this.formData.open_price,
            close_price: this.formData.close_price,
            profit: this.formData.profit,
            is_running: this.formData.is_running,
            note: this.formData.note
          }
          // 网络请求
          addStrategy(data).then(res => {
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
