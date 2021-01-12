<template>
  <div>
    <Tabs v-model="currentTabName" type="card" @on-click="tabClicked">
      <TabPane label="月统计" name="monthly" style="min-height: 300px">
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
            size="small"
            highlight-row
            stripe
            border
            :row-class-name="fixedTableRowHeight"
            :columns="monthStatisticsColumns"
            :data="monthStatisticsData"
            :loading="monthDataLoading">
          </Table>
        </Row>
      </TabPane>

      <TabPane label="年统计" name="annual" style="min-height: 300px">
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
        <Row style="height:40px" :gutter="8" type="flex" justify="start" align="middle" >
          <Col span="12">投顾方案年统计表</Col>
        </Row>
        <Row>
          <Table
            size="small"
            highlight-row
            stripe
            border
            :row-class-name="fixedTableRowHeight"
            :columns="yearStatisticsColumns"
            :data="yearStatisticsData"
            :loading="yearDataLoading">
          </Table>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getMonthInvestmentStatistics, getYearInvestmentStatistics } from '@/api/investment'
import { formatDate } from '@/libs/util'
export default {
  name: 'investment-statistics',
  data () {
    return {
      currentTabName: 'monthly',
      currentMonth: new Date(),
      currentYear: new Date(),

      monthDataLoading: true,
      monthStatisticsColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '策略数量',
          key: 'total_count',
          align: 'center',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '策略成功数',
          key: 'success_count',
          align: 'center',
          sortable: true
        },
        {
          title: '成功率',
          key: 'success_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.success_rate * 100).toFixed(0) + '%')
          }
        },
        {
          title: '累计收益额',
          key: 'sum_profit',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, params.row.sum_profit.toLocaleString())
          }
        },
        {
          title: '累计收益率',
          key: 'sum_profit_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        },
        {
          title: '平均收益率',
          key: 'avg_profit_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.avg_profit_rate * 100).toFixed(2) + '%')
          }
        },
        {
          title: '累计得分',
          key: 'sum_score',
          align: 'center',
          sortable: true
        }
      ],
      monthStatisticsData: [],

      yearDataLoading: true,
      yearStatisticsColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '策略数量',
          key: 'total_count',
          align: 'center',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '策略成功数',
          key: 'success_count',
          align: 'center',
          sortable: true
        },
        {
          title: '成功率',
          key: 'success_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.success_rate * 100).toFixed(0) + '%')
          }
        },
        {
          title: '年累计收益额',
          key: 'sum_profit',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, params.row.sum_profit.toLocaleString())
          }
        },
        {
          title: '年累计收益率',
          key: 'sum_profit_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        },
        {
          title: '平均收益率',
          key: 'avg_profit_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.avg_profit_rate * 100).toFixed(2) + '%')
          }
        },
        {
          title: '累计得分',
          key: 'sum_score',
          align: 'center',
          sortable: true
        }
      ],
      yearStatisticsData: []
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

  watch: {
    currentMonth () {
      this.getCurrentMonthStatistics()
    },
    currentYear () {
      this.getCurrentYearStatistics()
    }
  },

  methods: {
    getCurrentMonthStatistics () {
      getMonthInvestmentStatistics(formatDate(this.currentMonth)).then(res => {
        console.log(res)
        const data = res.data
        this.monthStatisticsData = data.statistics
        this.monthDataLoading = false
      }).catch(() => {
        console.log('获取月统计失败')
      })
    },

    getCurrentYearStatistics () {
      getYearInvestmentStatistics(formatDate(this.currentYear)).then(res => {
        console.log(res)
        const data = res.data
        this.yearStatisticsData = data.statistics
        this.yearDataLoading = false
      }).catch(() => {
        console.log('获取年统计失败')
      })
    },

    tabClicked (name) {
      this.currentTabName = name
      if (this.currentTabName === 'annual' && this.firstClickedTab) {
        this.getCurrentYearStatistics()
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

<style scoped>
  .ivu-table {
    color:#222222;
  }
  .fixed-row-height td{
    height: 30px;
  }
</style>
