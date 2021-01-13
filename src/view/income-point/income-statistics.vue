<template>
<div>
  <div style="margin: 5px;color: #fd7c3c"><h4>收入指标统计表</h4></div>
  <Table
    border
    size="small"
    show-summary
    sum-text="合计"
    :data="statisticsList"
    :columns="statisticsColumns">

  </Table>

</div>
</template>

<script>
import { getStatisticsCustomerRevenue } from '@/api/income-point'
import { mapState } from 'vuex'
export default {
  name: 'income-statistics',
  data () {
    return {
      statisticsList: [],
      statisticsColumns: [
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
          key: 'remain',
          align: 'center'
        },
        {
          title: '总利息',
          key: 'interest',
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
          render: (h, params) => {
            return h('div', {}, params.row.remain + params.row.interest)
          }
        }
      ]
    }
  },
  mounted () {
    this.getRevenueStatistics()
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  methods: {
    getRevenueStatistics () {
      getStatisticsCustomerRevenue(this.userToken, 1).then(res => {
        this.statisticsList = res.data.statistics
      }).catch(() => { this.$Message.error('获取统计数据失败!') })
    }
  }
}
</script>

<style scoped>

</style>
