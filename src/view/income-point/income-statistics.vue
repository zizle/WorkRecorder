<template>
<div>
  <Tabs v-model="currentTabName">
    <TabPane label="月统计" name="monthly">
      <Row style="height:40px" :gutter="16" type="flex" justify="start" align="middle">
          <Col>当前月份：</Col>
          <Col>
            <DatePicker
              type="month"
              size="small"
              style="width:100px"
              placeholder="选择月份"
              :value="currentMonth"
              @on-change="monthSelected">
            </DatePicker>
          </Col>
          <Col><Button size="small" @click="swapToPreMonth">上个月</Button></Col>
          <Col><Button size="small" @click="swapToNextMonth">下个月</Button></Col>
        </Row>
        <Row>
          <Table
            border
            size="small"
            show-summary
            sum-text="合计"
            :row-class-name="fixedTableRowHeight"
            :loading="monthDataLoading"
            :data="monthStatisticsData"
            :columns="monthStatisticsColumns">
          </Table>
        </Row>
    </TabPane>
    <TabPane label="年统计" name="annual">
      <Row style="height:40px" :gutter="16" type="flex" justify="start" align="middle">
        <Col>当前年份：</Col>
        <Col>
          <DatePicker
            type="year"
            size="small"
            style="width: 100px"
            placeholder="选择年份"
            :value="currentYear"
            @on-change="yearSelected">
          </DatePicker>
        </Col>
        <Col><Button size="small" @click="swapToPreYear">上一年</Button></Col>
        <Col><Button size="small" @click="swapToNextYear">下一年</Button></Col>
      </Row>
      <div style="margin: 5px;color: #fd7c3c"><h4>收入指标年统计表</h4></div>
      <Row>
        <Table
          border
          size="small"
          show-summary
          sum-text="合计"
          :row-class-name="fixedTableRowHeight"
          :loading="yearDataLoading"
          :data="yearStatisticsData"
          :columns="yearStatisticsColumns">
        </Table>
      </Row>
    </TabPane>
  </Tabs>
</div>
</template>

<script>
import { getMonthStatisticsRevenue, getYearStatisticsRevenue } from '@/api/income-point'
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
export default {
  name: 'income-statistics',
  data () {
    return {
      currentTabName: 'monthly',
      currentMonth: new Date(),
      currentYear: new Date(),
      monthDataLoading: true,
      monthStatisticsData: [],
      monthStatisticsColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '客户量',
          key: 'total_count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        },
        {
          title: '留存',
          key: 'sum_remain',
          align: 'center'
        },
        {
          title: '利息',
          key: 'sum_interest',
          align: 'center'
        },
        {
          title: '权益',
          key: 'crights',
          sortable: true,
          align: 'center'
        },
        {
          title: '收入',
          align: 'center',
          // render: (h, params) => {
          //   return h('div', {}, params.row.sum_remain + params.row.sum_interest)
          // }
          key: 'sum_income'
        }
      ],

      yearDataLoading: true,
      yearStatisticsData: [],
      yearStatisticsColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '客户量',
          key: 'total_count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        },
        {
          title: '总留存',
          key: 'sum_remain',
          align: 'center'
        },
        {
          title: '总利息',
          key: 'sum_interest',
          align: 'center'
        },
        {
          title: '总权益',
          key: 'crights',
          sortable: true,
          align: 'center'
        },
        {
          title: '总收入',
          align: 'center',
          // render: (h, params) => {
          //   return h('div', {}, params.row.sum_remain + params.row.sum_interest)
          // }
          key: 'sum_income'
        }
      ]

    }
  },
  mounted () {
    // 当前月份日期设置
    let currentDate = new Date()
    currentDate.setDate(1)
    this.currentMonth = currentDate

    let currentYear = new Date()
    currentYear.setMonth(0)
    currentYear.setDate(1)
    this.currentYear = currentYear
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  watch: {
    currentMonth () {
      this.getMonthRevenueStatistics()
    },
    currentYear () {
      this.getYearRevenueStatistics()
    }
  },
  methods: {
    getMonthRevenueStatistics () {
      getMonthStatisticsRevenue(formatDate(this.currentMonth)).then(res => {
        this.monthStatisticsData = res.data.statistics
        this.monthDataLoading = false
      }).catch(() => { this.$Message.error('获取月统计数据失败!') })
    },

    getYearRevenueStatistics () {
      getYearStatisticsRevenue(formatDate(this.currentYear)).then(res => {
        this.yearStatisticsData = res.data.statistics
        this.yearDataLoading = false
      }).catch(() => { this.$Message.error('获取年统计数据失败!') })
    },

    tabClicked (name) {
      this.currentTabName = name
      if (this.currentTabName === 'annual' && this.firstClickedTab) {
        this.getRevenueStatistics()
      }
    },

    monthSelected (dateStr) {
      const d = new Date(dateStr)
      d.setDate(1)
      this.currentMonth = d
    },

    yearSelected (yearStr) {
      this.currentYear = new Date(yearStr)
    },

    swapToPreMonth () {
      let d = new Date()
      const m = this.currentMonth.getMonth()
      const y = this.currentMonth.getFullYear()
      if (m === 0) {
        d.setFullYear(y - 1)
        d.setMonth(11)
      } else {
        d.setFullYear(y)
        d.setMonth(m - 1)
      }
      d.setDate(1)
      this.currentMonth = d
    },

    swapToPreYear () {
      let d = new Date()
      const y = this.currentYear.getFullYear()
      d.setFullYear(y - 1)
      d.setMonth(0)
      d.setDate(1)
      this.currentYear = d
    },

    swapToNextMonth () {
      let d = new Date()
      const m = this.currentMonth.getMonth()
      const y = this.currentMonth.getFullYear()
      if (m === 11) {
        d.setFullYear(y + 1)
        d.setMonth(0)
      } else {
        d.setFullYear(y)
        d.setMonth(m + 1)
      }
      d.setDate(1)
      this.currentMonth = d
    },

    swapToNextYear () {
      let d = new Date()
      const y = this.currentYear.getFullYear()
      d.setFullYear(y + 1)
      d.setMonth(0)
      d.setDate(1)
      this.currentYear = d
    },

    fixedTableRowHeight () {
      return 'fixed-row-height'
    }

  }
}
</script>

<style>
  .ivu-table {
    color:#222222;
  }
  .fixed-row-height td{
    height: 30px;
  }
</style>
