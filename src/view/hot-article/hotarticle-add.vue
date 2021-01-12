<template>
  <div>
    <Card>
    <Form ref="formData" :label-width="80" :model="formData" :rules="ruleForm">
      <FormItem label="发表日期">
        <DatePicker v-model="formData.create_date" placeholder="选择文章发表的日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="标题"  prop="title">
        <Input placeholder="文章的标题" type="text" v-model="formData.title"></Input>
      </FormItem>
      <FormItem label="发表媒体"  prop="media_name">
        <Input placeholder="文章发表的目标媒体名称" type="text" v-model="formData.media_name"></Input>
      </FormItem>
      <FormItem label="稿件类型" prop="rough_type">
        <Select filterable clearable v-model="formData.rough_type">
          <Option value="约稿">约稿</Option>
          <Option value="投稿">投稿</Option>
          <Option value="其他">其他</Option>
        </Select>
      </FormItem>
      <FormItem label="字数" prop="words">
        <Input placeholder="文章的字数,默认为0" type="number" v-model="formData.words"></Input>
      </FormItem>
      <FormItem label="审核人" prop="checker">
        <Input placeholder="文章的审核人" type="text" v-model="formData.checker"></Input>
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
      <FormItem label="是否外发" prop="is_publish">
        <RadioGroup v-model="formData.is_publish">
          <Radio :label=1>是</Radio>
          <Radio :label=0>否</Radio>
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
        <Button type="primary" @click="submitHotArticle">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
      </FormItem>
    </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { addHotArticle } from '@/api/hot-article'
export default {
  name: 'abnormal-add',
  data () {
    const validateTitle = (r, v, callback) => {
      if (v === '') { callback(new Error('工作标题不能为空')) } else (callback())
    }
    const validateWords = (r, v, callback) => {
      if (v === '') { this.formData.words = 0 } else (callback())
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
        media_name: '',
        rough_type: '约稿',
        words: '',
        checker: '',
        allowance: '',
        partner: '',
        score: '',
        note: ''
      },
      ruleForm: {
        title: [{ validator: validateTitle, trigger: 'blur' }],
        score: [{ validator: validateScore, trigger: 'blur' }],
        words: [{ validator: validateWords, trigger: 'blur' }],
        allowance: [{ validator: validateAllowance, trigger: 'blur' }],
        partner: [{ validator: validatePartner, trigger: 'blur' }]
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

    submitHotArticle () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          const bodyData = {
            user_token: this.userToken,
            create_time: formatDate(this.formData.create_date),
            title: this.formData.title,
            media_name: this.formData.media_name,
            rough_type: this.formData.rough_type,
            words: this.formData.words,
            checker: this.formData.checker,
            allowance: this.formData.allowance,
            partner: this.formData.partner,
            score: this.formData.score,
            note: this.formData.note,
            is_publish: this.formData.is_publish
          }

          formData.append('body_data', JSON.stringify(bodyData))

          if (this.annex_file === null) {
          } else {
            formData.append('annex_file', this.annex_file)
          }
          // 上传
          addHotArticle(formData).then(res => {
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
