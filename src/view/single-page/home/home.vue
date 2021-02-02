<template>
  <div>
<!--    <Row type="flex" align="center" justify="center">-->
<!--      <Col class="sys-title">欢迎使用工作数据管理系统2.0</Col>-->
<!--    </Row>-->
<!--    <br>-->
    <Row :gutter="16">
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#2d8cf0" icon="md-text" :icon-size="36">
          <count-to :end="msgCount" count-class="count-style"/>
          <p>短讯通</p>
          <p v-if="msgPercent!==100" class="module-percent">{{msgPercent}}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#19be6b" icon="md-locate" :icon-size="36">
          <count-to :end="strategyCount" count-class="count-style"/>
          <p>投顾策略</p>
          <p v-if="msgPercent!==100" class="module-percent">{{ strategyPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#ff9900" icon="md-book" :icon-size="36">
          <count-to :end="investmentCount" count-class="count-style"/>
          <p>投资方案</p>
          <p v-if="msgPercent!==100" class="module-percent">{{ investmentPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#ed3f14" icon="md-bookmark" :icon-size="36">
          <count-to :end="abnormalCount" count-class="count-style"/>
          <p>非常态工作</p>
          <p v-if="msgPercent!==100" class="module-percent">{{ abnormalPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#9A66E4" icon="ios-paper" :icon-size="36">
          <count-to :end="articleCount" count-class="count-style"/>
          <p>热点文章</p>
          <p v-if="msgPercent!==100" class="module-percent">{{ articlePercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px" v-if="ondutyMsgCount!==0">
        <infor-card shadow color="#E46CBB" icon="ios-chatbubbles" :icon-size="36">
          <count-to :end="ondutyMsgCount" count-class="count-style"/>
          <p>值班信息</p>
          <p v-if="msgPercent!==100" class="module-percent">{{ ondutyMsgPercent }}%</p>
        </infor-card>
      </Col>
    </Row>
<!--    <Row>-->
<!--      <Card shadow>-->
<!--        <AmountLines style="height:400px;"/>-->
<!--      </Card>-->
<!--    </Row>-->
    <div v-if="isAdmin">
      <Row>
        <div style="margin: 5px;color: #fd7c3c"><h4>短讯通年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isMsgSsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="shortMsgTableData"
          :loading="msgTableLoading"
        >
        </Table>
      </Row>
      <Row>
        <br>
        <div style="margin: 5px;color: #fd7c3c"><h4>投顾策略年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isStrategySsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="strategyTableData"
          :loading="strategyTableLoading"
        >
        </Table>
      </Row>
      <Row>
        <br>
        <div style="margin: 5px;color: #fd7c3c"><h4>投资方案年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isInvestmentSsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="investmentTableData"
          :loading="investmentTableLoading"
        >

        </Table>
      </Row>
      <Row>
        <br>
        <div style="margin: 5px;color: #fd7c3c"><h4>非常态工作年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isAbworkSsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="abnormalTableData"
          :loading="abnormalTableLoading"
        >

        </Table>
      </Row>
      <Row>
        <br>
        <div style="margin: 5px;color: #fd7c3c"><h4>热点文章年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isArticleSsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="articleTableData"
          :loading="articleTableLoading"
        >

        </Table>
      </Row>
      <Row v-if="this.ondutyMsgCount>0">
        <br>
        <div style="margin: 5px;color: #fd7c3c"><h4>值班信息年统计表</h4></div>
        <Table
          border size="small"
          sum-text="合计"
          :show-summary="isOndusySsm"
          :row-class-name="fixedRowHeight"
          :columns="statisticsColumns"
          :data="ondutyTableData"
          :loading="ondutyTableLoading"
        >
        </Table>
      </Row>
    </div>
    <div v-else>
      <div style="margin: 5px;color: #fd7c3c"><h4>各版块数量统计</h4></div>
      <Table
          border size="small"
          :row-class-name="fixedRowHeight"
          :columns="userOwnTableColumns"
          :data="userOwnTableData"
          :loading="userOwnTableLoading"
        >
        </Table>

    </div>
    <Row>
      <br>
      <div style="margin: 5px;color: #fd7c3c"><h4>收入指标({{ curStatisticsYear }}年)</h4></div>
      <Table
        border size="small"
        sum-text="合计"
        :show-summary="isRevenueSsm"
        :row-class-name="fixedRowHeight"
        :columns="revenueTableColumns"
        :data="revenueTableData"
      >

      </Table>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
// import AmountLines from './amount-lines.vue'
import { mapState } from 'vuex'
import { getShortMsgYearTotal } from '@/api/short-message'
import { getStrategyYearTotal } from '@/api/strategy'
import { getInvestmentYearTotal } from '@/api/investment'
import { getAbnormalYearTotal } from '@/api/abnormal'
import { getArticleYearTotal } from '@/api/hot-article'
import { getOndutyMsgYearTotal } from '@/api/onduty-message'
import { getCustomerRevenueYearTotal } from '@/api/income-point'
// import { setUserAccess } from '../../../api/user'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo
    // AmountLines
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      userAccess: state => state.user.access,
      systemUsers: state => state.user.systemUsers
    })
  },
  data () {
    return {
      statisticsColumns: [],

      isMsgSsm: false,
      msgTableLoading: true,
      shortMsgTableData: [],
      msgCount: 0,
      msgPercent: 0,

      isStrategySsm: false,
      strategyTableLoading: true,
      strategyTableData: [],
      strategyCount: 0,
      strategyPercent: 0,

      isInvestmentSsm: false,
      investmentTableLoading: true,
      investmentTableData: [],
      investmentCount: 0,
      investmentPercent: 0,

      isAbworkSsm: false,
      abnormalTableLoading: true,
      abnormalTableData: [],
      abnormalCount: 0,
      abnormalPercent: 0,

      isArticleSsm: false,
      articleTableLoading: true,
      articleTableData: [],
      articleCount: 0,
      articlePercent: 0,

      isOndusySsm: false,
      ondutyTableData: [],
      ondutyTableLoading: true,
      ondutyMsgCount: 0,
      ondutyMsgPercent: 0,

      isRevenueSsm: false,
      revenueTableData: [],
      revenueTableLoading: true,
      revenueTableColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center',
          className: 'header-name'
        },
        {
          title: '客户量',
          key: 'total_count',
          align: 'center',
          className: 'header-name'
        },
        {
          title: '留存',
          key: 'sum_remain',
          align: 'center',
          className: 'header-name'
        },
        {
          title: '利息',
          key: 'sum_interest',
          align: 'center',
          className: 'header-name'
        },
        {
          title: '权益',
          key: 'crights',
          align: 'center',
          className: 'header-name'
        },
        {
          title: '收入',
          align: 'center',
          // render: (h, params) => {
          //   return h('div', {}, params.row.sum_remain + params.row.sum_interest)
          // }
          key: 'sum_income',
          className: 'header-name'
        }
      ],
      curStatisticsYear: '',

      isAdmin: false,
      groupUserIds: [],
      // 用户个人展示的表
      userOwnTableColumns: [],
      userOwnTableData: [],
      userOwnTableLoading: true,
      shortMsgOk: 0,
      strategyOk: 0,
      investmentOK: 0,
      abnormalOk: 0,
      articleOk: 0,
      ondutyOk: 0

    }
  },
  mounted () {
    console.log(this.userToken)
    console.log(this.userAccess)

    this.setIsAdmin()
    this.setGroupIds()
    this.initMonthColumns()

    this.getCurYearMsg() // 获取用户短信通的当年累计
    this.getCurYearStrategy() //  获取用户投顾策略的当年累计
    this.getCurYearInvestment() //  获取用户投资方案的当年累计
    this.getCurYearAbnormalWork() //  获取用户非常规工作当年累计
    this.getCurYearArticleWork() //  获取用户热点文章当年累计
    this.getCurYearOndutyMsgWork() //  获取用户值班信息当年累计
    this.getCureYearIncomeRevenue() //  获取收入指标的当年累计表
  },
  methods: {
    // 判断是管理员(组长)还是普通用户
    setIsAdmin () {
      this.userAccess.some((item, index) => {
        if (item === 'admin' || item === 'leader') {
          this.isAdmin = true
          return true
        } else {
          this.isAdmin = false
        }
      })
    },

    // 设置组ids
    setGroupIds () {
      console.log(this.systemUsers)
      const ids = []
      this.systemUsers.forEach((item, index) => {
        ids.push(item.id)
      })
      this.groupUserIds = ids
    },

    // 初始化月份表头
    initMonthColumns () {
      const curDate = new Date()
      let y = curDate.getFullYear()
      const m = curDate.getMonth()
      const d = curDate.getDate()
      if (m <= 0 && d < 28) {
        y = y - 1
      }
      for (let i = 1; i <= 12; i += 1) {
        const s = y + '-' + (Array(2).join('0') + i).slice(-2)
        if (i === 1) {
          this.statisticsColumns.push(
            {
              title: '姓名',
              key: 'username',
              align: 'center',
              className: 'header-name'
            }
          )
          this.userOwnTableColumns.push(
            { title: '项目', key: 'module_name', align: 'center', className: 'header-name' }
          )
        }
        this.statisticsColumns.push(
          {
            title: s.replace('-', '.'),
            key: s,
            align: 'center',
            className: 'header-name'
          }
        )

        this.userOwnTableColumns.push(
          {
            title: s.replace('-', '.'),
            key: s,
            align: 'center',
            className: 'header-name'
          }
        )
      }
      this.statisticsColumns.push(
        {
          title: '合计',
          key: 'year_total',
          align: 'center',
          className: 'header-name'
        }
      )
      this.userOwnTableColumns.push(
        {
          title: '合计',
          key: 'year_total',
          align: 'center',
          className: 'header-name'
        }
      )
      this.curStatisticsYear = y
    },

    getCurYearMsg () {
      getShortMsgYearTotal(this.userToken).then(res => {
        const data = res.data
        this.msgCount = data.total_count
        this.msgPercent = data.percent
        this.shortMsgTableData = data.month_count
        this.msgTableLoading = false
        if (this.shortMsgTableData.length > 1) {
          this.isMsgSsm = true
        }
        if (this.shortMsgTableData.length > 0) {
          // 个人显示的表
          this.shortMsgTableData.forEach((item, index) => {
            item.module_name = '短讯通'
            this.userOwnTableData.push(item)
          })
        }
        this.shortMsgOk = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    isAllDataOk () {
      if (this.shortMsgOk === 1 && this.strategyOk === 1 && this.investmentOK === 1 &&
      this.abnormalOk === 1 && this.articleOk === 1 && this.ondutyOk === 1) {
        return 1
      } else {
        return 0
      }
    },

    getCurYearStrategy () {
      getStrategyYearTotal(this.userToken).then(res => {
        const data = res.data
        this.strategyCount = data.total_count
        this.strategyPercent = data.percent
        this.strategyTableData = data.month_count
        this.strategyTableLoading = false
        if (this.strategyTableData.length > 1) {
          this.isStrategySsm = true
        }

        if (this.strategyTableData.length > 0) {
          // 个人显示的表
          this.strategyTableData.forEach((item, index) => {
            item.module_name = '投顾策略'
            this.userOwnTableData.push(item)
          })
        }
        this.strategyOk = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    getCurYearInvestment () {
      getInvestmentYearTotal(this.userToken).then(res => {
        const data = res.data
        this.investmentCount = data.total_count
        this.investmentPercent = data.percent
        this.investmentTableData = data.month_count
        this.investmentTableLoading = false
        if (this.investmentTableData.length > 1) {
          this.isInvestmentSsm = true
        }
        if (this.investmentTableData.length > 0) {
          // 个人显示的表
          this.investmentTableData.forEach((item, index) => {
            item.module_name = '投资方案'
            this.userOwnTableData.push(item)
          })
        }
        this.investmentOK = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    getCurYearAbnormalWork () {
      getAbnormalYearTotal(this.userToken).then(res => {
        const data = res.data
        this.abnormalCount = data.total_count
        this.abnormalPercent = data.percent
        this.abnormalTableData = data.month_count
        this.abnormalTableLoading = false
        if (this.abnormalTableData.length > 1) {
          this.isAbworkSsm = true
        }
        // 个人显示的表
        if (this.abnormalTableData.length > 0) {
          this.abnormalTableData.forEach((item, index) => {
            item.module_name = '非常态工作'
            this.userOwnTableData.push(item)
          })
        }
        this.abnormalOk = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    getCurYearArticleWork () {
      getArticleYearTotal(this.userToken).then(res => {
        const data = res.data
        this.articleCount = data.total_count
        this.articlePercent = data.percent
        this.articleTableData = data.month_count
        this.articleTableLoading = false
        if (this.articleTableData.length > 1) {
          this.isArticleSsm = true
        }
        if (this.articleTableData.length > 0) {
          // 个人显示的表
          this.articleTableData.forEach((item, index) => {
            item.module_name = '热点文章'
            this.userOwnTableData.push(item)
          })
        }
        this.articleOk = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    getCurYearOndutyMsgWork () {
      getOndutyMsgYearTotal(this.userToken).then(res => {
        const data = res.data
        this.ondutyMsgCount = data.total_count
        this.ondutyMsgPercent = data.percent
        this.ondutyTableData = data.month_count
        this.ondutyTableLoading = false
        if (this.ondutyTableData.length > 1) {
          this.isOndusySsm = true
        }

        if (this.ondutyTableData.length > 0) {
          // 个人显示的表
          this.ondutyTableData.forEach((item, index) => {
            item.module_name = '值班信息'
            this.userOwnTableData.push(item)
          })
        }
        this.ondutyOk = 1
        if (this.isAllDataOk() === 1) {
          this.userOwnTableLoading = false
        }
      })
    },

    getCureYearIncomeRevenue () {
      getCustomerRevenueYearTotal(this.userToken).then(res => {
        const data = res.data
        this.revenueTableData = data.statistics
        this.revenueTableLoading = false
        if (this.revenueTableData.length > 1) {
          this.isRevenueSsm = true
        }
      })
    },

    fixedRowHeight (row, index) {
      if (index % 2 === 0) {
        return 'ivu-table-stripe-even'
      } else {
        return 'ivu-table-stripe-odd'
      }
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 35px;
}
  .sys-title{
    font-size: 25px;
    color: #1890ff;
    font-weight: bold;
  }
.ivu-table{
  color: #000c17;
}

/*.ivu-table tr:last-child td{*/
/*  height: 25px;*/
/*  max-height: 25px;*/
/*  !*border-color: #797979;*!*/
/*  font-weight: bold;*/
/*}*/
.ivu-table th.header-name{
  height: 25px;
  max-height: 30px;
  padding: 2px 0;
  background-color: #6acfb8;
  /*border-color: #797979;*/
}
.ivu-table-cell{
  padding: 0;
}
/*偶数行*/
.ivu-table-stripe-even td{
  background-color: #f4f4f4!important;
  height: 22px;
  max-height: 22px;
  /*border-color: #797979;*/
  font-weight: normal!important;
}
/*奇数行*/
.ivu-table-stripe-odd td{
  background-color: #e7f1f0!important;
  height: 22px;
  max-height: 22px;
  /*border-color: #797979;*/
  font-weight: normal!important;
}
/*选中某一行高亮*/
/*.ivu-table-row-highlight td {*/
/*  background-color:#6caef4!important;*/
/*}*/
/*浮在某行*/
.ivu-table-row-hover td {
  background-color:#6caef4!important;
  color: #F0F0F0!important;
}
.ivu-table-wrapper{
  border: 1px solid #999999;
  /*border-bottom: 0;*/
  border-right: 0;
}
.ivu-table-summary{
  border-top: 1px solid #999999;
}
.ivu-table-border td, .ivu-table-border th{
  border-color: #999999;
}
.ivu-table-summary td{
  border-color: #999999;
  height: 26px;
  font-weight: bold;
}
.module-percent{
  font-size: 10px;
  color: #999999;
}
</style>
