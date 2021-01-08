<template>
  <div>
    <template>
      <Tabs v-model="currentTabName" type="card" @on-click="tabClicked">
        <TabPane label="月统计" name="monthly">
          <Row style="height:40px" :gutter="16" type="flex" justify="start" align="middle">
            <Col>当前月份：</Col>
            <Col>
              <DatePicker
                type="month"
                size="small"
                style="width: 100px"
                placeholder="选择月份"
                :value="currentDate"
                @on-change="dateSelected">
              </DatePicker>
            </Col>
            <Col><Button size="small" @click="swapToPreMonth">上个月</Button></Col>
            <Col><Button size="small" @click="swapToNextMonth">下个月</Button></Col>
          </Row>
          <Row style="height:40px" :gutter="8" type="flex" justify="start" align="middle" >
            <Col span="12">月统计表</Col>
            <Col span="12">月标记数量统计表</Col>
          </Row>
          <Row :gutter="8">
            <Col span="12">
              <Table
                size="small"
                highlight-row
                stripe
                show-summary
                border
                sum-text="合计"
                :row-class-name="fixedRowHeight"
                :columns="monthAmountRankColumns"
                :data="monthAmountRankData"
                :loading="monthRankLoading">
              </Table>
            </Col>
            <Col span="12">
              <Table
                size="small"
                highlight-row
                stripe
                border
                show-summary
                sum-text="合计"
                :row-class-name="fixedRowHeight"
                :columns="monthQualityRankColumns"
                :data="monthQualityRankData"
                :loading="monthRankLoading">
              </Table>
            </Col>
          </Row>
          <Row style="height:40px" type="flex" justify="start" align="middle">
            <Col>每日数量明细表</Col>
          </Row>
          <Row>
            <Table
              size="small"
              highlight-row
              border
              :row-class-name="detailTableRowClass"
              :columns="monthDetailColumns"
              :data="monthDetailData"
              :loading="monthDetailLoading">
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
                style="width:80px"
                placeholder="选择年份"
                :value="currentYear"
                @on-change="yearSelected">
              </DatePicker>
            </Col>
            <Col><Button size="small" @click="swapToPreYear">上一年</Button></Col>
            <Col><Button size="small" @click="swapToNextYear">下一年</Button></Col>
          </Row>
          <Row style="height:40px" :gutter="8" type="flex" justify="start" align="middle" >
            <Col span="12">年统计表</Col>
            <Col span="12">年标记数量统计表</Col>
          </Row>
          <Row :gutter="8">
            <Col span="12">
              <Table
                size="small"
                highlight-row
                stripe
                show-summary
                border
                sum-text="合计"
                :row-class-name="fixedRowHeight"
                :columns="yearAmountRankColumns"
                :data="yearAmountRankData"
                :loading="yearRankLoading">
              </Table>
            </Col>
            <Col span="12">
              <Table
                size="small"
                highlight-row
                stripe
                border
                show-summary
                sum-text="合计"
                :row-class-name="fixedRowHeight"
                :columns="yearQualityRankColumns"
                :data="yearQualityRankData"
                :loading="yearRankLoading">
              </Table>
            </Col>
          </Row>
          <Row style="height:40px" type="flex" justify="start" align="middle">
            <Col>每月数量明细表</Col>
          </Row>
          <Row>
            <Table
              size="small"
              highlight-row
              stripe
              border
              show-summary
              sum-text="合计"
              :row-class-name="detailTableRowClass"
              :columns="yearDetailColumns"
              :data="yearDetailData"
              :loading="yearDetailLoading">
            </Table>
          </Row>
        </TabPane>
      </Tabs>
    </template>
  </div>
</template>
<script>
import { formatDate } from '@/libs/util'
import {
  getMonthRank, getMonthDetail,
  getYearRank, getYearDetail
} from '@/api/short-message'
export default {
  name: 'shortmsg-statistics',
  data () {
    return {
      currentTabName: 'monthly',
      firstClickedTab: true,

      currentDate: new Date(),
      currentYear: new Date(),

      // 月排名数据
      monthRankLoading: true,
      // 月数量排名
      monthAmountRankColumns: [
        {
          title: '排名',
          key: 'rank',
          align: 'center',
          width: 70
        },
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '数量',
          key: 'count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        }
      ],
      monthAmountRankData: [],
      // 月质量排名
      monthQualityRankColumns: [
        {
          title: '排名',
          key: 'rank',
          width: 70,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '标记数',
          key: 'count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        }
      ],
      monthQualityRankData: [],
      // 月明细
      monthDetailColumns: [],
      monthDetailLoading: true,
      monthDetailData: [],
      // 年排名数据
      yearRankLoading: true,
      // 年数量排名
      yearAmountRankColumns: [
        {
          title: '排名',
          key: 'rank',
          align: 'center',
          width: 70
        },
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '数量',
          key: 'count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        }
      ],
      yearAmountRankData: [],
      // 年质量排名
      yearQualityRankColumns: [
        {
          title: '排名',
          key: 'rank',
          width: 70,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '标记数',
          key: 'count',
          sortable: true,
          sortType: 'desc',
          align: 'center'
        }
      ],
      yearQualityRankData: [],
      // 年明细
      yearDetailColumns: [],
      yearDetailLoading: true,
      yearDetailData: []
    }
  },
  mounted () {
    // 当前月份日期设置
    let currentDate = new Date()
    currentDate.setDate(1)
    this.currentDate = currentDate
    // 当前年份设置
    let currentYear = new Date()
    currentYear.setMonth(0)
    currentYear.setDate(1)
    this.currentYear = currentYear
  },
  watch: {
    currentDate () {
      this.getMonthDetailHeaders() // 生成本月详情数据表格的表头
      this.getMonthRankData() // 获取月排名数据
      this.getMonthDetailData() // 获取月明细数据
    },
    currentYear () {
      this.getYearDetailHeaders()
      this.getYearRankData()
      this.getYearDetailData()
    }
  },
  methods: {
    // 标签被点击
    tabClicked (tabName) {
      this.currentTabName = tabName
      if (this.currentTabName === 'annual' && this.firstClickedTab) {
        this.getYearDetailHeaders()
        this.getYearRankData()
        this.getYearDetailData()
      }
    },
    // 获取月份的详情日期
    getMonthDetailHeaders () {
      let nextMonthDate = new Date()
      const detailHeaders = [
        { title: '姓名', key: 'username', width: 60, align: 'center', fixed: 'left' }
      ]
      const m = this.currentDate.getMonth()
      const y = this.currentDate.getFullYear()
      if (m === 11) {
        nextMonthDate.setFullYear(y + 1)
        nextMonthDate.setMonth(0)
      } else {
        nextMonthDate.setFullYear(y)
        nextMonthDate.setMonth(m + 1)
      }
      nextMonthDate.setDate(1)
      for (let i = this.currentDate.getTime(); i < nextMonthDate.getTime(); i += 24 * 60 * 60 * 1000) {
        let d = new Date(i)
        const dateStr = formatDate(d)
        detailHeaders.push(
          {
            title: dateStr.substring(5, 10).replace('-', '.'),
            key: dateStr,
            width: 40,
            align: 'right'
          }
        )
      }
      this.monthDetailColumns = detailHeaders
    },
    // 获取一年内的所有月份
    getYearDetailHeaders () {
      const detailHeaders = [
        { title: '姓名', key: 'username', width: 60, align: 'center', fixed: 'left' }
      ]
      const y = this.currentYear.getFullYear()
      for (let i = 1; i <= 12; i += 1) {
        const s = y + '-' + (Array(2).join('0') + i).slice(-2)
        detailHeaders.push(
          {
            title: s.replace('-', '.'),
            key: s,
            align: 'center'
          }
        )
      }
      this.yearDetailColumns = detailHeaders
    },
    swapToPreMonth () {
      let d = new Date()
      const m = this.currentDate.getMonth()
      const y = this.currentDate.getFullYear()
      if (m === 0) {
        d.setFullYear(y - 1)
        d.setMonth(11)
      } else {
        d.setFullYear(y)
        d.setMonth(m - 1)
      }
      d.setDate(1)
      this.currentDate = d
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
      const m = this.currentDate.getMonth()
      const y = this.currentDate.getFullYear()
      if (m === 11) {
        d.setFullYear(y + 1)
        d.setMonth(0)
      } else {
        d.setFullYear(y)
        d.setMonth(m + 1)
      }
      d.setDate(1)
      this.currentDate = d
    },
    swapToNextYear () {
      let d = new Date()
      const y = this.currentYear.getFullYear()
      d.setFullYear(y + 1)
      d.setMonth(0)
      d.setDate(1)
      this.currentYear = d
    },
    dateSelected (dateStr) {
      const d = new Date(dateStr)
      d.setDate(1)
      this.currentDate = d
    },
    yearSelected (yearStr) {
      let d = new Date(yearStr)
      this.currentYear = d
    },
    // 请求月排名数据
    getMonthRankData () {
      getMonthRank(formatDate(this.currentDate)).then(res => {
        this.monthRankLoading = false
        const data = res.data
        this.monthAmountRankData = data.amount_rank
        this.monthQualityRankData = data.quality_rank
      }).catch(() => {

      })
    },
    // 请求年排名数据
    getYearRankData () {
      getYearRank(formatDate(this.currentYear)).then(res => {
        const data = res.data
        this.yearRankLoading = false
        this.yearAmountRankData = data.amount_rank
        this.yearQualityRankData = data.quality_rank
      }).catch(() => {

      })
    },
    // 请求月详情数据
    getMonthDetailData () {
      getMonthDetail(formatDate(this.currentDate)).then(res => {
        const data = res.data
        this.monthDetailLoading = false
        this.monthDetailData = data.month_detail
      }).catch(() => {

      })
    },
    getYearDetailData () {
      getYearDetail(formatDate(this.currentYear)).then(res => {
        const data = res.data
        this.yearDetailLoading = false
        this.yearDetailData = data.year_detail
      }).catch(() => {
      })
    },
    detailTableRowClass (row, index) {
      if (index % 2 === 0) {
        return 'table-color-row'
      } else {
        return 'table-no-color-row'
      }
    },

    fixedRowHeight () {
      return 'fixed-row-height'
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
  .ivu-table .table-color-row td{
    background-color:#e7f1f0;
    height: 30px;
  }
  .ivu-table .table-no-color-row td{
    background-color:#f4f4f4;
    height: 30px;
  }
  .ivu-table-cell {
    padding-left:1px;
    padding-right:4px;
  }
</style>
