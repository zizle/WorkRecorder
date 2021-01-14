<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import { getAllMonthStatistics } from '@/api/statistics'
import { mapState } from 'vuex'
export default {
  name: 'amount-lines',
  data () {
    return {
      dom: null
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    // 生成当前年份的月份数据为横坐标
    getxAxis () {
      const xAxis = []
      const cDate = new Date()
      const y = cDate.getFullYear()
      for (let i = 1; i <= 12; i += 1) {
        const s = (y - 1) + '-' + (Array(2).join('0') + i).slice(-2)
        xAxis.push(s)
      }
      return xAxis
    }
  },
  mounted () {
    let options = {}
    getAllMonthStatistics(this.userToken).then(res => {
      // 生成series
      const seriesLine = []
      const legend = []
      const seriesData = res.data.data
      seriesData.forEach((item, index) => {
        const lineObj = {
          name: item.series_name,
          type: 'line',
          stack: '总量',
          smooth: true,
          connectNulls: true,
          areaStyle: { color: item.area_color },
          itemStyle: { color: item.area_color },
          lineStyle: { color: item.area_color },
          data: item.series_data.map(d => { return [d.month, d.count] })
        }
        // if (item.series_name === '短讯通'){
        //   lineObj['yAxisIndex'] = 1
        // }
        seriesLine.push(lineObj)
        legend.push(item.series_name)
      })

      options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.getxAxis()
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            scale: true
          }
        ],
        series: seriesLine
      }
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(options)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
