<template>
  <div>
  <Card>
    <Row :gutter="16" type="flex" justify="start" align="middle">
<!--      查询选项-->
      <Col>开始日期:</Col>
      <Col><DatePicker v-model="startDate" size="small" style="width:115px" @on-change="startDateChanged"></DatePicker></Col>
      <Col>结束日期:</Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词段辅助检索" v-model="searchKeyWord" /></label></Col>
      <Col><Button size="small" type="primary" @click="handleQueryAbnormal">查询</Button></Col>
    </Row>
  </Card>
    <Row>
<!--      结果表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>我的非常规工作</h4></div>
    <Table border size="small" :columns="abnormalColumns" :data="abnormalList">
      <template slot-scope="{ row }" slot="otherInfo">
        <div style="color:#57a3f3;cursor: pointer" @click="showRowDetail(row)">详细</div>
      </template>
      <template slot-scope="{ row, index }" slot="actions">
        <div style="cursor: pointer">
          <span @click="editAbnormal(index)" style="margin-right: 2px;color:#2d8cf0">编辑</span> |
          <span @click="removeAbnormal(index)" style="margin-left: 2px;color: #ed4014">删除</span>
        </div>
      </template>
    </Table>
  </Row>

<!--   弹窗显示工作的其他信息-->
  <Modal v-model="isShowRowDetail" class-name="detail-modal" title="工作其他信息">
    <div>
      <Row>
        <Col span="8">收入补贴:</Col>
        <Col>{{ currentRowData.allowance }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">主办方:</Col>
        <Col>{{ currentRowData.sponsor }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">申请者:</Col>
        <Col>{{ currentRowData.applicant }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">联系电话:</Col>
        <Col>{{ currentRowData.phone }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">工作类别:</Col>
        <Col>{{ currentRowData.task_name }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">备注:</Col>
        <Col>{{ currentRowData.note }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">附件:</Col>
        <Col>
          <div v-if="currentRowData.annex"><a :href="currentRowData.annex_url">{{currentRowData.annex}}</a></div>
          <div v-else>无</div>
        </Col>
      </Row>
    </div>
  </Modal>
<!-- 弹窗编辑非工作条目-->
  <Modal v-model="isShowEdit" :model="currentRowData" title="编辑我的方案" @on-ok="submitEditAbnormal" :loading="modifyLoading">
    <Form ref="editFrom" :label-width="80">
      <FormItem label="标题">
        <Input type="text" v-model="currentRowData.title"></Input>
      </FormItem>
      <FormItem label="主办方">
        <Input type="text" v-model="currentRowData.sponsor"></Input>
      </FormItem>
      <FormItem label="申请者">
        <Input type="text" v-model="currentRowData.applicant"></Input>
      </FormItem>
      <FormItem label="联系电话">
        <Input type="text" v-model="currentRowData.phone"></Input>
      </FormItem>
      <FormItem label="瑞币情况">
        <Input type="number" v-model="currentRowData.swiss_coin"></Input>
      </FormItem>
      <FormItem label="合作者">
        <Input type="text" v-model="currentRowData.partner"></Input>
      </FormItem>
      <FormItem label="评级得分">
        <RadioGroup v-model="currentRowData.score">
          <Radio :label=5>5</Radio>
          <Radio :label=4>4</Radio>
          <Radio :label=3>3</Radio>
          <Radio :label=2>2</Radio>
          <Radio :label=1>1</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注">
        <Input type="text" v-model="currentRowData.note"></Input>
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
    </Form>
  </Modal>
  </div>
</template>

<script>
import { queryAbnormal, deleteOneAbnormal, modifyAbnormal } from '@/api/abnormal'
import { formatDate } from '@/libs/util'
import { mapState } from 'vuex'
export default {
  name: 'investment-my',
  mounted () {
    const cDate = new Date(this.startDate)
    cDate.setMonth(cDate.getMonth() - 1)
    this.startDate = cDate
    // 初始化数据
    this.getCurrentAbnormal()
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      varietyList: state => state.variety.varietyList
    })
  },
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      searchKeyWord: '',

      abnormalColumns: [
        {
          title: '工作日期',
          key: 'create_time',
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '瑞币情况',
          key: 'swiss_coin',
          align: 'center'
        },
        {
          title: '评级得分',
          key: 'score',
          align: 'center'
        },
        {
          title: '是否有效',
          key: 'is_examined',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.is_examined ? '是' : '否')
          }
        },
        {
          title: '其他',
          align: 'center',
          width: 80,
          slot: 'otherInfo'
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          slot: 'actions'
        }
      ],
      abnormalList: [],
      isShowRowDetail: false,
      isShowEdit: false,
      currentRowData: {},
      modifyLoading: false,
      annex_file: null,
      selectedFile: []
    }
  },
  methods: {
    startDateChanged (dateStr) {
      if (dateStr > formatDate(this.endDate)) {
        this.$Modal.error({ title: '错误', content: '开始日期需要小于等于结束日期!' })
        this.startDate = this.endDate
      }
    },

    endDateChanged (dateStr, date) {
      if (dateStr < formatDate(this.startDate)) {
        this.$Modal.error({ title: '错误', content: '结束日期需要大于等于开始日期!' })
        this.endDate = this.startDate
      }
    },

    handleQueryAbnormal () {
      this.getCurrentAbnormal()
    },
    getCurrentAbnormal () {
      const endDate = new Date()
      endDate.setFullYear(this.endDate.getFullYear())
      endDate.setMonth(this.endDate.getMonth())
      endDate.setDate(this.endDate.getDate() + 1) // 由于不包含this.endDate指定日期,所以+1
      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(endDate),
        is_audit: 0,
        keyword: ''
      }
      queryAbnormal(reqData).then(res => {
        const data = res.data
        this.abnormalList = data.abnormal_works
      }).catch(() => { this.$Message.error('获取数据失败了!') })
    },

    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },

    handleUploadAnnex (file) {
      this.annex_file = file
      this.selectedFile = [{ name: this.annex_file.name }]
      return false
    },

    removeSelectedFile () {
      this.selectedFile = []
      this.annex_file = null
    },

    editAbnormal (index) {
      this.currentRowData = this.abnormalList[index]
      if (this.currentRowData.annex !== '') {
        this.selectedFile = [{ name: this.currentRowData.annex }]
      }
      this.isShowEdit = true
    },

    removeAbnormal (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          const currentItem = this.abnormalList[index]
          deleteOneAbnormal(currentItem.id, this.userToken).then(() => {
            this.abnormalList.splice(index, 1)
            this.$Message.success('删除成功!')
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
    },
    submitEditAbnormal () {
      this.modifyLoading = true
      const reqData = new FormData()
      const bodyData = {
        user_token: this.userToken,
        abnormal_id: this.currentRowData.id,
        title: this.currentRowData.title,
        sponsor: this.currentRowData.sponsor,
        applicant: this.currentRowData.applicant,
        phone: this.currentRowData.phone,
        swiss_coin: this.currentRowData.swiss_coin,
        partner: this.currentRowData.partner,
        score: this.currentRowData.score,
        note: this.currentRowData.note
      }
      reqData.append('body_data', JSON.stringify(bodyData))
      if (this.annex_file === null) {
      } else {
        reqData.append('annex_file', this.annex_file)
      }
      modifyAbnormal(reqData, this.currentRowData.id).then(res => {
        this.modifyLoading = false
        this.$Message.success('修改成功!')
        this.annex_file = null
        this.selectedFile = []
      }).catch(() => {
        this.modifyLoading = false
        this.$Message.error('修改失败了!')
      })
    }
  }
}
</script>

<style>
  .ivu-table {
    color:#222222;
  }
  .ivu-table .fixed-row-height td{
    height: 30px;
  }
  .detail-modal{
    text-align: center;
  }

</style>
