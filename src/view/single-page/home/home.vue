<template>
  <div>
<!--    <Row type="flex" align="center" justify="center">-->
<!--      <Col class="sys-title">欢迎使用工作数据管理系统2.0</Col>-->
<!--    </Row>-->
<!--    <br>-->
    <Row :gutter="20">
      <Col span="4" style="height:120px">
        <infor-card shadow color="#2d8cf0" icon="md-person-add" :icon-size="36">
          <count-to :end="msgCount" count-class="count-style"/>
          <p>短讯通</p>
          <p>占比:{{msgPercent}}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px">
        <infor-card shadow color="#19be6b" icon="md-locate" :icon-size="36">
          <count-to :end="strategyCount" count-class="count-style"/>
          <p>投顾策略</p>
          <p>占比:{{ strategyPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px">
        <infor-card shadow color="#ff9900" icon="md-help-circle" :icon-size="36">
          <count-to :end="investmentCount" count-class="count-style"/>
          <p>投资方案</p>
          <p>占比:{{ investmentPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px">
        <infor-card shadow color="#ed3f14" icon="md-share" :icon-size="36">
          <count-to :end="abnormalCount" count-class="count-style"/>
          <p>非常态工作</p>
          <p>占比:{{ abnormalPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px">
        <infor-card shadow color="#E46CBB" icon="md-chatbubbles" :icon-size="36">
          <count-to :end="0" count-class="count-style"/>
          <p>收入指标</p>
          <p>占比:-%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px">
        <infor-card shadow color="#9A66E4" icon="md-map" :icon-size="36">
          <count-to :end="0" count-class="count-style"/>
          <p>热点文章</p>
          <p>占比:-%</p>
        </infor-card>
      </Col>

    </Row>
    <br>
    <Row>
      <Card shadow>
        <AmountLines style="height:400px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import AmountLines from './amount-lines.vue'
import { mapState } from 'vuex'
import { getShortMsgYearTotal } from '@/api/short-message'
import { getStrategyYearTotal } from '@/api/strategy'
import { getInvestmentYearTotal } from '@/api/investment'
import { getAbnormalYearTotal } from '@/api/abnormal'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    AmountLines
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  data () {
    return {
      msgCount: 0,
      msgPercent: 0,

      strategyCount: 0,
      strategyPercent: 0,

      investmentCount: 0,
      investmentPercent: 0,

      abnormalCount: 0,
      abnormalPercent: 0

    }
  },
  mounted () {
    this.getCurYearMsg() // 获取用户短信通的当年累计
    this.getCurYearStrategy() //  获取用户投顾策略的当年累计
    this.getCurYearInvestment() //  获取用户投资方案的当年累计
    this.getCurYearAbnormalWork() //  获取用户非常规工作当年累计
  },
  methods: {
    getCurYearMsg () {
      getShortMsgYearTotal(this.userToken).then(res => {
        const data = res.data
        this.msgCount = data.total_count
        this.msgPercent = data.percent
      })
    },

    getCurYearStrategy () {
      getStrategyYearTotal(this.userToken).then(res => {
        const data = res.data
        this.strategyCount = data.total_count
        this.strategyPercent = data.percent
      })
    },

    getCurYearInvestment () {
      getInvestmentYearTotal(this.userToken).then(res => {
        const data = res.data
        this.investmentCount = data.total_count
        this.investmentPercent = data.percent
      })
    },

    getCurYearAbnormalWork () {
      getAbnormalYearTotal(this.userToken).then(res => {
        const data = res.data
        this.abnormalCount = data.total_count
        this.abnormalPercent = data.percent
      })
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
</style>
