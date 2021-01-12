<template>
  <div>
    <Card>
    <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
      <FormItem label="工作日期">
        <DatePicker v-model="formData.create_date" placeholder="选择工作产生的日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="标题"  prop="title">
        <Input placeholder="非常规工作的标题" type="text" v-model="formData.title"></Input>
      </FormItem>
      <FormItem label="工作类型" prop="task_type">
        <Select filterable clearable v-model="formData.task_type">
          <Option :value="1">报告演讲</Option>
          <Option :value="2">内外培训</Option>
          <Option :value="3">材料撰写</Option>
          <Option :value="4">协同开发</Option>
          <Option :value="5">课件制作</Option>
          <Option :value="6">客户服务</Option>
          <Option :value="7">调研组织</Option>
          <Option :value="8">外部活动</Option>
          <Option :value="9">其他</Option>
        </Select>
      </FormItem>
      <FormItem label="主办方" prop="sponsor">
        <Input placeholder="主办方名称" type="text" v-model="formData.sponsor"></Input>
      </FormItem>
      <FormItem label="申请者" prop="build_hands">
        <Input placeholder="申请者名称" type="text" v-model="formData.applicant"></Input>
      </FormItem>
      <FormItem label="联系电话" prop="phone">
        <Input placeholder="申请者的联系电话" type="text" v-model="formData.phone"></Input>
      </FormItem>
      <FormItem label="瑞币情况" prop="swiss_coin">
        <Input placeholder="瑞币收入情况记录,默认值为0" type="number" v-model="formData.swiss_coin"></Input>
      </FormItem>
      <FormItem label="收入补贴" prop="allowance">
        <Input placeholder="收入补贴情况记录,默认值为0" type="number" v-model="formData.allowance"></Input>
      </FormItem>
      <FormItem label="合作者" prop="partner">
        <Input placeholder="记录一起合作完成的人,默认为`无`" type="text" v-model="formData.partner"></Input>
      </FormItem>
      <FormItem label="评级得分" prop="score">
        <RadioGroup v-model="formData.score">
          <Radio :label=5>5</Radio>
          <Radio :label=4>4</Radio>
          <Radio :label=3>3</Radio>
          <Radio :label=2>2</Radio>
          <Radio :label=1>1</Radio>
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
        <Button type="primary" @click="submitAbnormal">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
      </FormItem>
    </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { addAbnormal } from '@/api/abnormal'
export default {
  name: 'abnormal-add',
  data () {
    const validateTitle = (r, v, callback) => {
      if (v === '') { callback(new Error('工作标题不能为空')) } else (callback())
    }
    const validateTaskType = (r, v, callback) => {
      if (v === '') { callback(new Error('任务类型为必选')) } else (callback())
    }
    const validateSwissCoin = (r, v, callback) => {
      if (v === '') { this.formData.swiss_coin = 0 } else (callback())
    }
    const validateAllowance = (r, v, callback) => {
      if (v === '') { this.formData.allowance = 0 } else (callback())
    }
    const validateScore = (r, v, callback) => {
      if (v === '') { callback(new Error('评级得分为必选')) } else (callback())
    }
    const validatePartner = (r, v, callback) => {
      if (v === '') { this.formData.partner = '无' } else (callback())
    }
    return {
      annex_file: null,
      selectedFile: [],
      formData: {
        create_date: new Date(),
        title: '',
        task_type: '',
        sponsor: '',
        applicant: '',
        phone: '',
        swiss_coin: '',
        allowance: '',
        partner: '',
        score: '',
        note: ''
      },
      ruleForm: {
        title: [{ validator: validateTitle, trigger: 'blur' }],
        task_type: [{ validator: validateTaskType, trigger: 'blur' }],
        score: [{ validator: validateScore, trigger: 'blur' }],
        allowance: [{ validator: validateAllowance, trigger: 'blur' }],
        partner: [{ validator: validatePartner, trigger: 'blur' }],
        swiss_coin: [{ validator: validateSwissCoin, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
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

    submitAbnormal () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          const bodyData = {
            user_token: this.userToken,
            create_time: formatDate(this.formData.create_date),
            title: this.formData.title,
            task_type: this.formData.task_type,
            sponsor: this.formData.sponsor,
            applicant: this.formData.applicant,
            phone: this.formData.phone,
            swiss_coin: this.formData.swiss_coin,
            allowance: this.formData.allowance,
            partner: this.formData.partner,
            score: this.formData.score,
            note: this.formData.note
          }

          formData.append('body_data', JSON.stringify(bodyData))

          if (this.annex_file === null) {
          } else {
            formData.append('annex_file', this.annex_file)
          }
          // 上传
          addAbnormal(formData).then(res => {
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
