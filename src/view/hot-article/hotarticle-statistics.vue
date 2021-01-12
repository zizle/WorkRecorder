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
          <Col span="12">热点文章年统计表</Col>
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
import { getMonthArticleStatistics, getYearArticleStatistics } from '@/api/hot-article'
import { formatDate } from '@/libs/util'
export default {
  name: 'article-statistics',
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
          title: '数量',
          key: 'total_count',
          align: 'center',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '评级总分',
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
          title: '数量',
          key: 'total_count',
          align: 'center',
          sortable: true,
          sortType: 'desc'
        },
        {
          title: '评级总分',
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
      getMonthArticleStatistics(formatDate(this.currentMonth)).then(res => {
        const data = res.data
        this.monthStatisticsData = data.statistics
        this.monthDataLoading = false
      }).catch(() => {
        this.$Message.error('获取月统计失败')
      })
    },

    getCurrentYearStatistics () {
      getYearArticleStatistics(formatDate(this.currentYear)).then(res => {
        const data = res.data
        this.yearStatisticsData = data.statistics
        this.yearDataLoading = false
      }).catch(() => {
        this.$Message.error('获取年统计失败')
      })
    },

    tabClicked (name) {
      this.currentTabName = name
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
