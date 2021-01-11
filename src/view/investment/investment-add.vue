<template>
  <div>
    <Card>
    <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
      <FormItem label="方案日期">
        <DatePicker v-model="formData.create_date" placeholder="选择方案建立的日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="方案标题"  prop="title">
        <Input placeholder="投资方案的标题" type="text" v-model="formData.title"></Input>
      </FormItem>
      <FormItem label="品种" prop="variety_en">
        <Select filterable clearable v-model="formData.variety_en">
          <Option v-for="item in varietyList" :key="item.id" :value="item.variety_en">{{ item.variety_name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="合约月份" prop="contract">
        <Input placeholder="录入品种4位数合约月份" type="number" v-model="formData.contract"></Input>
      </FormItem>
      <FormItem label="投资方向">
        <RadioGroup v-model="formData.direction">
          <Radio label="多头">多头</Radio>
          <Radio label="空头">空头</Radio>
          <Radio label="套利">套利</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="实建均价" prop="build_price">
        <Input placeholder="记录建仓的价格" type="number" v-model="formData.build_price"></Input>
      </FormItem>
      <FormItem label="实建手数" prop="build_hands">
        <Input placeholder="手数仅支持整数" type="number" v-model="formData.build_hands"></Input>
      </FormItem>
      <FormItem label="实出均价" prop="sale_price">
        <Input placeholder="记录平仓的价格,默认值为0" type="number" v-model="formData.sale_price"></Input>
      </FormItem>
      <FormItem label="止损均价" prop="cutloss_price">
        <Input placeholder="记录止损的价格,默认值为0" type="number" v-model="formData.cutloss_price"></Input>
      </FormItem>
      <FormItem label="有效期止" prop="expire_date">
        <DatePicker v-model="formData.expire_date" placeholder="选择方案的有效日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="方案结果" placeholder="用`+`和`-`表示盈亏" prop="profit">
        <Input placeholder="记录方案的盈亏结果,默认为0" type="number" v-model="formData.profit"></Input>
      </FormItem>
      <FormItem label="是否外发">
        <RadioGroup v-model="formData.is_publish">
          <Radio :label=1>是</Radio>
          <Radio :label=0>否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="方案评级" prop="level">
        <Select filterable clearable v-model="formData.level">
          <Option :value=5>五级</Option>
          <Option :value=4>四级</Option>
          <Option :value=3>三级</Option>
          <Option :value=2>二级</Option>
          <Option :value=1>一级</Option>
        </Select>
      </FormItem>
      <FormItem label="状态">
        <RadioGroup v-model="formData.is_running">
          <Radio :label=1>运行中</Radio>
          <Radio :label=0>已结束</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注" prop="note">
        <Input type="text" placeholder="备注" v-model="formData.note"></Input>
      </FormItem>
      <FormItem label="附件">
        <Upload
          action=""
          :before-upload="handleUploadAnnex"
          :default-file-list="selectedFile"
          :on-remove="removeSelectedFile">
          <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
        </Upload>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitInvestment">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
      </FormItem>
    </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { addInvestment } from '@/api/investment'
export default {
  name: 'investment-add',
  data () {
    const validateVarietyEN = (r, v, callback) => {
      if (v === '') { callback(new Error('品种不能为空')) } else { callback() }
    }
    const validateContract = (r, v, callback) => {
      if (v === '') {
        callback(new Error('品种合约月份不能为空'))
      } else if (String(v).length !== 4) { callback(new Error('品种合约月份需为4位数')) } else (callback())
    }
    const validateTitle = (r, v, callback) => {
      if (v === '') { callback(new Error('策略标题不能为空')) } else (callback())
    }
    const validateHands = (r, v, callback) => {
      if (v === '') { callback(new Error('手数为必填')) } else (callback())
    }
    const validateBuildPrice = (r, v, callback) => {
      if (v === '') { callback(new Error('实建均价为必填')) } else (callback())
    }
    const validateSalePrice = (r, v, callback) => {
      if (v === '') { this.formData.sale_price = 0 } else (callback())
    }
    const validateCutlossPrice = (r, v, callback) => {
      if (v === '') { this.formData.cutloss_price = 0 } else (callback())
    }
    const validateProfit = (r, v, callback) => {
      if (v === '') { this.formData.profit = 0 } else (callback())
    }
    const validateLevel = (r, v, callback) => {
      if (v === '') { callback(new Error('方案评级为必选')) } else (callback())
    }
    return {
      annex_file: null,
      selectedFile: [],
      formData: {
        create_date: new Date(),
        title: '',
        variety_en: '',
        contract: '',
        direction: '多头',
        build_price: '',
        build_hands: '',
        sale_price: '',
        cutloss_price: '',
        expire_date: new Date(),
        profit: '',
        is_publish: 1,
        level: '',
        is_running: 0,
        note: ''
      },
      ruleForm: {
        variety_en: [{ validator: validateVarietyEN, trigger: 'blur' }],
        contract: [{ validator: validateContract, trigger: 'blur' }],
        title: [{ validator: validateTitle, trigger: 'blur' }],
        build_hands: [{ validator: validateHands, trigger: 'blur' }],
        build_price: [{ validator: validateBuildPrice, trigger: 'blur' }],
        sale_price: [{ validator: validateSalePrice, trigger: 'blur' }],
        cutloss_price: [{ validator: validateCutlossPrice, trigger: 'blur' }],
        profit: [{ validator: validateProfit, trigger: 'blur' }],
        level: [{ validator: validateLevel, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      varietyList: state => state.variety.varietyList
    })
  },
  methods: {
    handleUploadAnnex (file) {
      this.annex_file = file
      this.selectedFile = [{ name: this.annex_file.name }]
      return false
    },
    removeSelectedFile () {
      this.selectedFile = []
      this.annex_file = null
    },

    submitInvestment () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          const bodyData = {
            user_token: this.userToken,
            create_time: formatDate(this.formData.create_date),
            title: this.formData.title,
            variety_en: this.formData.variety_en,
            contract: this.formData.contract,
            direction: this.formData.direction,
            build_price: this.formData.build_price,
            build_hands: this.formData.build_hands,
            out_price: this.formData.sale_price,
            cutloss_price: this.formData.cutloss_price,
            expire_time: formatDate(this.formData.expire_date),
            is_publish: this.formData.is_publish,
            is_running: this.formData.is_running,
            score: this.formData.level,
            profit: this.formData.profit,
            note: this.formData.note
          }

          formData.append('body_data', JSON.stringify(bodyData))

          if (this.annex_file === null) {
          } else {
            formData.append('annex_file', this.annex_file)
          }
          // 上传
          addInvestment(formData).then(res => {
            this.$Message.success('添加成功!')
            this.handleReset()
          }).catch(() => {
            this.$Message.success('添加失败了!')
          })
        }
      })
    },
    handleReset () {
      this.$refs['formData'].resetFields()
      this.annex_file = null
      this.selectedFile = []
    }
  }
}
</script>

<style scoped>

</style>
