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
      <Col><Button size="small" type="primary" @click="handleQueryInvestment">查询</Button></Col>
    </Row>
  </Card>
   <Row>
<!--      结果表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>我的投资方案</h4></div>
    <Table border size="small" :columns="investmentColumns" :data="investmentList">
      <template slot-scope="{ row }" slot="otherInfo">
        <div style="color:#57a3f3;cursor: pointer" @click="showRowDetail(row)">详细</div>
      </template>
      <template slot-scope="{ row, index }" slot="actions">
        <div style="cursor: pointer">
          <span @click="editInvestment(index)" style="margin-right: 2px;color:#2d8cf0">编辑</span> |
          <span @click="removeInvestment(index)" style="margin-left: 2px;color: #ed4014">删除</span>
        </div>
      </template>
    </Table>
  </Row>

<!--   弹窗显示方案的其他信息-->
    <Modal v-model="isShowRowDetail" class-name="detail-modal" title="方案其他信息">
      <div>
        <Row>
          <Col span="8">有效期:</Col>
          <Col>{{ currentRowData.expire_time }}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">实建均价:</Col>
          <Col>{{ currentRowData.build_price }}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">实出均价:</Col>
          <Col>{{ currentRowData.out_price }}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">止损均价:</Col>
          <Col>{{ currentRowData.cutloss_price }}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">是否外发:</Col>
          <Col>{{ currentRowData.is_publish?'是':'否'}}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">评级得分:</Col>
          <Col>{{ currentRowData.score }}</Col>
        </Row>
        <br>
        <Row>
          <Col span="8">状态:</Col>
          <Col>{{ currentRowData.is_running?'运行中':'已结束'}}</Col>
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
            <div v-if="currentRowData.annex"><a :href="currentRowData.annex_url" target="blank">{{currentRowData.annex}}</a></div>
            <div v-else>无</div>
          </Col>
        </Row>
      </div>
    </Modal>
<!-- 弹窗编辑方案-->
    <Modal v-model="isShowEdit" :model="currentRowData" title="编辑我的方案" @on-ok="submitEditInvestment" :loading="modifyLoading">
      <Form ref="editFrom" :label-width="80">
        <FormItem label="实出均价">
          <Input type="number" v-model="currentRowData.out_price"></Input>
        </FormItem>
        <FormItem label="止损均价">
          <Input type="number" v-model="currentRowData.cutloss_price"></Input>
        </FormItem>
        <FormItem label="方案结果">
          <Input type="number" v-model="currentRowData.profit"></Input>
        </FormItem>
        <FormItem label="方案状态">
          <RadioGroup v-model="currentRowData.is_running">
            <Radio :label=1>运行中</Radio>
            <Radio :label=0>已结束</Radio>
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
import { queryInvestment, modifyInvestment, deleteOneInvestment } from '@/api/investment'
import { formatDate } from '@/libs/util'
import { mapState } from 'vuex'
export default {
  name: 'investment-my',
  mounted () {
    const cDate = new Date(this.startDate)
    cDate.setMonth(cDate.getMonth() - 1)
    this.startDate = cDate

    // 初始化数据
    this.getCurrentInvestment()
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

      investmentColumns: [
        {
          title: '创建日期',
          key: 'create_time',
          width: 100,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '品种',
          key: 'contract_name',
          align: 'center'
        },
        {
          title: '方向',
          key: 'direction',
          align: 'center'
        },
        {
          title: '盈亏',
          key: 'profit',
          align: 'center'
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
      investmentList: [],

      isShowRowDetail: false,
      isShowEdit: false,
      currentRowData: {},

      annex_file: null,
      selectedFile: [],
      modifyLoading: false

    }
  },
  watch: {
    isShowRowDetail () {
      if (!this.isShowRowDetail) {
        this.currentRowData = {}
      }
    },
    isShowEdit () {
      if (!this.isShowEdit) {
        this.selectedFile = []
        this.currentRowData = {}
        this.annex_file = null
      }
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

    handleQueryInvestment () {
      this.getCurrentInvestment()
    },
    getCurrentInvestment () {
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
      queryInvestment(reqData).then(res => {
        const data = res.data
        this.investmentList = data.investments
      }).catch(() => { this.$Message.error('获取数据失败了!') })
    },

    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },

    editInvestment (index) {
      this.currentRowData = this.investmentList[index]
      if (this.currentRowData.annex !== '') {
        this.selectedFile = [{ name: this.currentRowData.annex }]
      }
      this.isShowEdit = true
    },

    removeInvestment (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          const currentItem = this.investmentList[index]
          deleteOneInvestment(currentItem.id, this.userToken).then(() => {
            this.investmentList.splice(index, 1)
            this.$Message.success('删除成功!')
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
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

    // 提交修改的方案信息
    submitEditInvestment () {
      this.modifyLoading = true
      const reqData = new FormData()
      const bodyData = {
        user_token: this.userToken,
        investment_id: this.currentRowData.id,
        out_price: this.currentRowData.out_price,
        cutloss_price: this.currentRowData.cutloss_price,
        profit: this.currentRowData.profit,
        is_running: this.currentRowData.is_running,
        score: this.currentRowData.score,
        note: this.currentRowData.note
      }
      reqData.append('body_data', JSON.stringify(bodyData))
      if (this.annex_file === null) {
      } else {
        reqData.append('annex_file', this.annex_file)
      }
      modifyInvestment(reqData, this.currentRowData.id).then(res => {
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
