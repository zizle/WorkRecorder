<template>
  <div>
    <Tabs type="card">

      <TabPane label="月统计" name="monthly">
        <Row style="height:40px" :gutter="16" type="flex" justify="start" align="middle">
          <Col>当前月份：</Col>
          <Col>
            <DatePicker
              type="month"
              size="small"
              style="width: 100px"
              placeholder="选择月份"
              :value="currentMonth"
              @on-change="monthSelected">
            </DatePicker>
          </Col>
          <Col><Button size="small" @click="swapToPreMonth">上个月</Button></Col>
          <Col><Button size="small" @click="swapToNextMonth">下个月</Button></Col>
        </Row>

        <Row style="height:40px" :gutter="8" type="flex" justify="start" align="middle" >
          <Col span="12">投顾策略月统计表</Col>
        </Row>
        <Row>
          <Table
            size="small"
            highlight-row
            stripe
            border
            :columns="monthStatisticsColumns"
            :data="monthStatisticsData"
            :loading="monthDataLoading">
          </Table>
        </Row>
      </TabPane>

      <TabPane label="年统计" name="annual">

      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getMonthStrategyStatistics } from '@/api/strategy'
import { formatDate } from '@/libs/util'
export default {
  name: 'strategy-statistics',
  data () {
    return {
      currentMonth: new Date(),

      monthStatisticsColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '策略数量',
          key: 'total_count',
          align: 'center'
        },
        {
          title: '策略成功数',
          key: 'success_count',
          align: 'center'
        },
        {
          title: '成功率',
          key: 'success_rate',
          align: 'center',
          sortable: true,
          sortType: 'desc',
          render: (h, params) => {
            return h('div', {}, (params.row.success_rate * 100).toFixed(0) + '%')
          }
        },
        {
          title: '收益',
          key: 'sum_profit',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.sum_profit.toLocaleString())
          }
        },
        {
          title: '收益率',
          key: 'sum_profit_rate',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        }
      ],
      monthStatisticsData: [],
      monthDataLoading: false
    }
  },
  mounted () {
    // 当前月份日期设置
    let currentDate = new Date()
    currentDate.setDate(1)
    this.currentMonth = currentDate
  },
  watch: {
    currentMonth () {
      this.getCurrentMonthStatistics()
    }
  },
  methods: {
    monthSelected (dateStr) {
      const d = new Date(dateStr)
      d.setDate(1)
      this.currentMonth = d
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

    getCurrentMonthStatistics () {
      getMonthStrategyStatistics(formatDate(this.currentMonth)).then(res => {
        console.log(res)
        const data = res.data
        this.monthStatisticsData = data.statistics
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>

</style>
