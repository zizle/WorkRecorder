<template>
<!--  投资方案与记录查询,随登入用户的不同而显示不同的数据-->
  <div>
   <!--    选择人员的左侧抽屉-->
    <StaffDrawer :showStaffDrawer="isShowStaff"
                 @visibleChange="showStaffDrawerChanged"
                 @checkedChange="checkedStaffChanged"
    ></StaffDrawer>
<!--    查询条件卡-->
    <Card>
      <Row :gutter="16" type="flex" justify="start" align="middle">
        <Col v-if="isLeader"><Button type="info" size="small" @click="isShowStaff=true">选择人员</Button></Col>
        <Col v-if="isLeader">当前: <span style="color:#2886ff">{{ checkedName }}</span></Col>
        <Col :offset="isLeader? 1:0"><DateSetter ref="setDate"></DateSetter></Col>
        <Col><label><Input size="small" prefix="ios-search" placeholder="标题关键词辅助检索" v-model.trim="searchKeyWord"/></label></Col>
        <Col><Button size="small" type="primary" @click="queryDataRecords">查询</Button></Col>
      </Row>
    </Card>
<!--统计表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>投资方案统计<span style="font-size: 12px;color: #999999">(运行中的方案不计入)</span></h4></div>
    <Table
      size="small"
      highlight-row
      stripe
      border
      sum-text="合计"
      :show-summary="isLeader"
      :row-class-name="fixedRowHeight"
      :columns="statisticsTableColumns"
      :data="statisticsTableData"
      :loading="loadingStatistics"
    >
    </Table>
<!--    详情记录表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>详细记录({{detailTableData.length}})</h4></div>
    <Table
      border size="small"
      :columns="detailTableColumns"
      :data="detailTableData">
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
<!--   弹窗显示方案的其他信息-->
    <Modal
      v-model="isShowRowDetail"
      class-name="detail-modal"
      title="方案其他信息">
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
    <Modal
      v-model="isShowEdit"
      :model="currentRowData"
      title="编辑我的方案"
      @on-ok="submitEditInvestment"
      :width="60"
      :loading="modifyLoading">
      <Form ref="editFrom" :label-width="80">
        <Row>
          <Col span="12"><FormItem label="实建均价"><Input type="number" v-model="currentRowData.build_price"></Input></FormItem></Col>
          <Col span="12"><FormItem label="实建手数"><Input type="number" v-model="currentRowData.build_hands"></Input></FormItem></Col>
        </Row>
        <Row>
          <Col span="12"><FormItem label="实出均价"><Input type="number" v-model="currentRowData.out_price"></Input></FormItem></Col>
          <Col span="12"><FormItem label="止损均价"><Input type="number" v-model="currentRowData.cutloss_price"></Input></FormItem></Col>
        </Row>
        <Row>
          <Col span="12"><FormItem label="方案结果"><Input type="number" v-model="currentRowData.profit"></Input></FormItem></Col>
          <Col span="12">
            <FormItem label="评级得分">
              <RadioGroup v-model="currentRowData.score">
                <Radio :label=5>5</Radio>
                <Radio :label=4>4</Radio>
                <Radio :label=3>3</Radio>
                <Radio :label=2>2</Radio>
                <Radio :label=1>1</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="方案状态">
              <RadioGroup v-model="currentRowData.is_running">
                <Radio :label=1>运行中</Radio>
                <Radio :label=0>已结束</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col><FormItem label="备注"><Input type="text" v-model="currentRowData.note"></Input></FormItem></Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="附件">
              <Upload
                action=""
                :before-upload="handleUploadAnnex"
                :default-file-list="selectedFile"
                :on-remove="removeSelectedFile">
                <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { dateToString } from '@/libs/util'
import { getInvestmentRecords, deleteOneInvestment, modifyInvestment } from '@/api/investment'
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'
import { mapState } from 'vuex'

export default {
  name: 'investment',
  components: {
    StaffDrawer,
    DateSetter
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      varietyList: state => state.variety.varietyList
    })
  },
  data () {
    return {
      isShowStaff: false,
      isNotInitData: true, // 数据是否初始化选项
      userGroupIds: [],
      checkName: '',
      searchKeyWord: '',
      isLeader: false,

      loadingStatistics: true,
      loadingDetailRecords: true,
      statisticsTableData: [],
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '方案数量', key: 'total_count', align: 'center', sortable: true, sortType: 'desc'
        },
        { title: '成功数', key: 'success_count', align: 'center', sortable: true },
        { title: '成功率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.success_rate * 100).toFixed(0) + '%')
          }
        },
        { title: '累计收益额',
          key: 'sum_profit',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, params.row.sum_profit.toLocaleString())
          }
        },
        { title: '累计收益率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        },
        { title: '平均收益率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.avg_profit_rate * 100).toFixed(2) + '%')
          }
        },
        { title: '累计得分', key: 'sum_score', align: 'center', sortable: true }
      ],
      detailTableData: [],
      detailTableColumns: [
        { title: '创建日期', key: 'create_time', width: 100, align: 'center' },
        { title: '创建人', key: 'username', width: 80, align: 'center' },
        { title: '标题', key: 'title', align: 'center', minWidth: 120 },
        { title: '品种', key: 'contract_name', align: 'center' },
        { title: '方向', key: 'direction', align: 'center' },
        { title: '状态',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.is_running ? '运行' : '已结束')
          }
        },
        { title: '盈亏', key: 'profit', align: 'center' },
        { title: '其他', align: 'center', width: 80, slot: 'otherInfo' },
        { title: '操作', align: 'center', width: 100, slot: 'actions' }
      ],

      isShowRowDetail: false,
      currentRowData: {},

      isShowEdit: false,
      modifyLoading: false,
      annex_file: null,
      selectedFile: []
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
        this.currentRowData = {}
        this.selectedFile = []
        this.annex_file = null
      }
    }
  },
  methods: {
    queryDataRecords () {
      if (this.userGroupIds.length < 1) {
        this.$Modal.info({ title: '提示', content: '要查询的人员不能为空!' })
        return
      }
      this.setLoadingData(true)
      const seDates = this.getStartEndDate()
      const params = {
        currency: this.userGroupIds.toString(),
        start: seDates[0],
        end: seDates[1],
        kw: this.searchKeyWord
      }
      // 查询数据记录
      getInvestmentRecords(params).then(res => {
        const data = res.data
        this.statisticsTableData = data.statistics
        this.detailTableData = data.records.reverse()
        this.setLoadingData(false)
        this.isNotInitData = false
      })
    },
    // 抽屉人员选择子组件传出抽屉显示的状态
    showStaffDrawerChanged (visible) {
      this.isShowStaff = visible
    },
    // 子组件传出选择的人员变化
    checkedStaffChanged (checkedStaffs, checkName, isLeader) {
      this.userGroupIds = checkedStaffs
      this.checkedName = checkName
      this.isLeader = isLeader
      if (this.userGroupIds.length > 0 && this.isNotInitData) {
        this.queryDataRecords() //  初始化数据
      }
    },
    // 获取开始日期和结束日期
    getStartEndDate () {
      const sDate = this.$refs.setDate.startDate
      const eDate = this.$refs.setDate.endDate
      return [dateToString(sDate), dateToString(eDate)]
    },
    // 设置下载状态
    setLoadingData (loading) {
      this.loadingStatistics = loading
      this.loadingDetailRecords = loading
    },
    // 固定表格高度
    fixedRowHeight (row, index) {
      return 'table-fixed-height'
    },
    // 显示方案的详情
    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },
    // 编辑一条
    editInvestment (index) {
      // 已结束的非领导不能再编辑了
      this.currentRowData = this.detailTableData[index]
      if (!this.currentRowData.is_running && !this.isLeader) {
        this.$Modal.info({ title: '提示', content: '已结束的方案不能再编辑了!' })
        return
      }
      if (this.currentRowData.annex !== '') {
        this.selectedFile = [{ name: this.currentRowData.annex }]
      }
      this.isShowEdit = true
    },
    // 删除一条
    removeInvestment (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          const currentItem = this.detailTableData[index]
          deleteOneInvestment(currentItem.id, this.userToken).then(() => {
            this.detailTableData.splice(index, 1)
            this.$Message.success('删除成功!')
            // 刷新数据
            this.queryDataRecords()
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
    },
    // 提交编辑结果
    submitEditInvestment () {
      this.modifyLoading = true
      const reqData = new FormData()
      const bodyData = {
        user_token: this.userToken,
        investment_id: this.currentRowData.id,
        build_price: this.currentRowData.build_price,
        build_hands: this.currentRowData.build_hands,
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
        // 刷新数据
        this.queryDataRecords()
      }).catch(() => {
        this.modifyLoading = false
        this.$Message.error('修改失败了!')
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
    }
  }
}
</script>

<style>
.table-fixed-height td{
    height: 28px;
  }
</style>
