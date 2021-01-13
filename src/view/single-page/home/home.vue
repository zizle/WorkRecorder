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
          <p>占比:{{msgPercent}}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#19be6b" icon="md-locate" :icon-size="36">
          <count-to :end="strategyCount" count-class="count-style"/>
          <p>投顾策略</p>
          <p>占比:{{ strategyPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#ff9900" icon="md-book" :icon-size="36">
          <count-to :end="investmentCount" count-class="count-style"/>
          <p>投资方案</p>
          <p>占比:{{ investmentPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#ed3f14" icon="md-bookmark" :icon-size="36">
          <count-to :end="abnormalCount" count-class="count-style"/>
          <p>非常态工作</p>
          <p>占比:{{ abnormalPercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px">
        <infor-card shadow color="#9A66E4" icon="ios-paper" :icon-size="36">
          <count-to :end="articleCount" count-class="count-style"/>
          <p>热点文章</p>
          <p>占比:{{ articlePercent }}%</p>
        </infor-card>
      </Col>
      <Col span="4" style="height:120px;margin-bottom:10px" v-if="ondutyMsgCount!==0">
        <infor-card shadow color="#E46CBB" icon="ios-chatbubbles" :icon-size="36">
          <count-to :end="ondutyMsgCount" count-class="count-style"/>
          <p>值班信息</p>
          <p>占比:{{ ondutyMsgPercent }}%</p>
        </infor-card>
      </Col>
    </Row>
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
import { getArticleYearTotal } from '@/api/hot-article'
import { getOndutyMsgYearTotal } from '@/api/onduty-message'
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
      abnormalPercent: 0,

      articleCount: 0,
      articlePercent: 0,

      ondutyMsgCount: 0,
      ondutyMsgPercent: 0

    }
  },
  mounted () {
    this.getCurYearMsg() // 获取用户短信通的当年累计
    this.getCurYearStrategy() //  获取用户投顾策略的当年累计
    this.getCurYearInvestment() //  获取用户投资方案的当年累计
    this.getCurYearAbnormalWork() //  获取用户非常规工作当年累计
    this.getCurYearArticleWork() //  获取用户热点文章当年累计
    this.getCurYearOndutyMsgWork() //  获取用户值班信息当年累计
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
    },

    getCurYearArticleWork () {
      getArticleYearTotal(this.userToken).then(res => {
        const data = res.data
        this.articleCount = data.total_count
        this.articlePercent = data.percent
      })
    },

    getCurYearOndutyMsgWork () {
      getOndutyMsgYearTotal(this.userToken).then(res => {
        const data = res.data
        this.ondutyMsgCount = data.total_count
        this.ondutyMsgPercent = data.percent
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
