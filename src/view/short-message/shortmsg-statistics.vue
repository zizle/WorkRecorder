<template>
  <div>
    <template>
      <Tabs value="monthly" type="card" :animated="false">
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
              stripe
              :columns="monthDetailColumns"
              :data="monthDetailData"
              :loading="monthDetailLoading">
            </Table>
          </Row>

        </TabPane>
        <TabPane label="年统计" name="annual">
          <div>
            <Table>

            </Table>
          </div>
        </TabPane>
      </Tabs>
    </template>
  </div>
</template>

<script>
import { formatDate } from '@/libs/util'
import { getMonthRank, getMonthDetail } from '@/api/short-message'
export default {
  name: 'shortmsg-statistics',
  data () {
    return {
      currentDate: new Date(),

      // 排名数据
      monthRankLoading: true,
      // 数量排名
      monthAmountRankColumns: [
        {
          title: '排名',
          key: 'rank',
          align: 'right',
          width: 70
        },
        {
          title: '姓名',
          key: 'username',
          align: 'right'
        },
        {
          title: '数量',
          key: 'count',
          sortable: true,
          sortType: 'desc',
          align: 'right'
        }
      ],
      monthAmountRankData: [],
      // 质量排名
      monthQualityRankColumns: [
        {
          title: '排名',
          key: 'rank',
          width: 70,
          align: 'right'
        },
        {
          title: '姓名',
          key: 'username',
          align: 'right'
        },
        {
          title: '标记数',
          key: 'count',
          sortable: true,
          align: 'right'
        }
      ],
      monthQualityRankData: [],

      // 月明细
      monthDetailColumns: [],
      monthDetailLoading: true,
      monthDetailData: []
    }
  },
  mounted () {
    // 当前月份日期设置
    let currentDate = new Date()
    currentDate.setDate(1)
    this.currentDate = currentDate
  },
  watch: {
    currentDate () {
      console.log(formatDate(this.currentDate))
      // 生成本月详情数据表格的表头
      this.getMonthDetailHeaders()
      this.getMonthRankData()
      this.getMonthDetailData()
    }
  },
  methods: {
    getMonthDetailHeaders () {
      let nextMonthDate = new Date()
      const detailHeaders = [
        { title: '姓名', key: 'username', width: 80, fixed: 'left' }
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
        let d3 = new Date(i)
        const dateStr = formatDate(d3)
        detailHeaders.push(
          {
            title: dateStr,
            key: dateStr,
            width: 98,
            align: 'right'
          }
        )
      }
      this.monthDetailColumns = detailHeaders
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
    dateSelected (dateStr) {
      const d = new Date(dateStr)
      d.setDate(1)
      this.currentDate = d
    },
    // 请求月排名数据
    getMonthRankData () {
      getMonthRank(formatDate(this.currentDate)).then(res => {
        console.log(res)
        this.monthRankLoading = false
        const data = res.data
        this.monthAmountRankData = data.amount_rank
        this.monthQualityRankData = data.quality_rank
      }).catch(() => {

      })
    },
    // 请求月详情数据
    getMonthDetailData () {
      getMonthDetail(formatDate(this.currentDate)).then(res => {
        console.log(res)
        const data = res.data
        this.monthDetailLoading = false
        this.monthDetailData = data.month_detail
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.expand-row{
  margin-bottom: 16px;
}
</style>
