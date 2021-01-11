<template>
  <div>
  <Card>
    <Row :gutter="16" type="flex" justify="start" align="middle">
<!--      查询选项-->
      <Col>开始日期:</Col>
      <Col><DatePicker v-model="startDate" size="small" style="width:115px" @on-change="startDateChanged"></DatePicker></Col>
      <Col>结束日期:</Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词段辅助检索" v-model="searchKeyWord" /></label></Col>
      <Col><Button size="small" type="primary" @click="handleQueryStrategy">查询</Button></Col>
    </Row>
  </Card>
  <Row>
<!--      统计表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>查询结果统计表</h4></div>
    <Table border size="small" :columns="statisticsTableColumns" :data="statisticsTableData"></Table>
  </Row>
<!--    详情数据-->
  <div style="margin: 5px;color: #fd7c3c"><h4>详细数据</h4></div>
  <List :header="listHeaderText" border size="small" item-layout="vertical">
    <ListItem v-for="item in strategyList" :key="item.id">
      <Row :gutter="8" type="flex" justify="start" align="middle">
        <Col span="4">创建日期：<span class="blue">{{item.create_time}}</span></Col>
        <Col span="3">合约：<span class="blue">{{ item.contract_name }}</span></Col>
        <Col span="2">方向：<span class="blue">{{item.direction}}</span></Col>
        <Col span="2">手数：<span class="blue">{{item.hands}}</span></Col>
        <Col span="3">开仓：<span class="blue">{{item.open_price}}</span></Col>
        <Col span="3">平仓：<span class="blue">{{item.close_price}}</span></Col>
        <Col span="3">盈亏：<span :class="item.profit>=0?'red':'green'">{{item.profit}}</span></Col>
        <Col span="3">收益率：<span :class="(item.profit/100000).toFixed(2)>0?'red':'green'">{{(item.profit / 100000).toFixed(2) * 100}}%</span></Col>
      </Row>
      <Row class="strategy-content">{{item.content}}</Row>
      <Row class="strategy-note" v-if="item.note">备注：{{item.note}}</Row>
      <Row type="flex" align="middle">
        <Col span="1"><div class="msg-author">{{ item.username }}</div></Col>
        <Col span="1" push="1"><div :class="item.is_running? 'stra-status-runing':'stra-status'">{{ item.is_running? '运行中':'已结束' }}</div></Col>
        <Col span="22">
          <div class="slotAction">
            <ul>
              <li style="color: #2d8cf0"  @click="handleEditStrategy(item.id)">编辑</li>
              <li style="color: #ee1235" @click="handleDelStrategy(item.id)">删除</li>
            </ul>
          </div>
        </Col>
      </Row>
    </ListItem>
  </List>
  <Row style="text-align: right">
    <Page  :total="totalCount" :page-size="pageSize" @on-change="pageChange" show-total />
  </Row>
<!--    编辑策略-->
  <Modal v-model="showEditModal" title="编辑投顾策略" :loading="modalEditLoading" @on-ok="confirmEditStrategy">
    <Form ref="modifyForm" :label-width="80" :model="editFormData">
      <FormItem label="策略开仓" prop="open_price">
        <Input type="number" placeholder="开仓时的价格" v-model="editFormData.open_price"></Input>
      </FormItem>
      <FormItem label="策略平仓" prop="close_price">
        <Input type="number" placeholder="平仓时的价格" v-model="editFormData.close_price"></Input>
      </FormItem>
      <FormItem label="结果收益" prop="profit">
        <Input type="number" placeholder="用`+`和`-`表示盈亏" v-model="editFormData.profit"></Input>
      </FormItem>
      <FormItem label="状态">
        <RadioGroup v-model="editFormData.is_running">
          <Radio :label=1>运行中</Radio>
          <Radio :label=0>已结束</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注">
        <Input type="text" placeholder="备注" v-model="editFormData.note"></Input>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import { queryStrategy, modifyOneStrategy, deleteOneStrategy } from '@/api/strategy'
import { formatDate } from '@/libs/util'
import { mapState } from 'vuex'
export default {
  name: 'strategy-my',
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),

      statisticsTableColumns: [
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
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        }
      ],
      statisticsTableData: [],

      listHeaderText: '这里空空什么也没有!',
      strategyList: [],

      currentPage: 1,
      totalCount: 0,
      pageSize: 30,
      searchKeyWord: '',

      currentStraIndexOf: -1,

      showEditModal: false,
      modalEditLoading: false,

      editFormData: {
        strategyId: -1,
        open_price: 0,
        close_price: 0,
        profit: 0,
        is_running: 0,
        note: ''
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  mounted () {
    const cDate = new Date(this.startDate)
    cDate.setMonth(cDate.getMonth() - 1)
    this.startDate = cDate

    // 初始化数据
    this.getCurrentStrategy()
  },
  methods: {
    startDateChanged (dateStr) {
      if (dateStr > formatDate(this.endDate)) {
        this.$Modal.error({ title: '错误', content: '开始日期需要小于等于结束日期!' })
        this.startDate = this.endDate
      }
    },

    endDateChanged (dateStr, date) {
      if (dateStr < formatDate(this.startDate)) {
        this.$Modal.error({ title: '错误', content: '结束日期需要大于等于开始日期!' })
        this.endDate = this.startDate
      }
    },
    // 获取当前用户的查询记录
    getCurrentStrategy () {
      const endDate = new Date()
      endDate.setFullYear(this.endDate.getFullYear())
      endDate.setMonth(this.endDate.getMonth())
      endDate.setDate(this.endDate.getDate() + 1) // 由于不包含this.endDate指定日期,所以+1
      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(endDate),
        page: this.currentPage,
        page_size: this.pageSize,
        keyword: this.searchKeyWord
      }
      queryStrategy(reqData).then(res => {
        const data = res.data
        this.statisticsTableData = data.statistics
        this.listHeaderText = '我的投顾策略'
        this.strategyList = data.strategies
        this.totalCount = data.total_count
      }).catch(() => {
      })
    },

    handleQueryStrategy () {
      this.currentPage = 1
      this.getCurrentStrategy()
    },

    handleEditStrategy (straId) {
      this.setCurStrategyIndexOf(straId)
      if (this.currentStraIndexOf !== -1) {
        // 检测策略的状态
        const straItem = this.strategyList[this.currentStraIndexOf]
        if (!straItem.is_running) {
          this.$Modal.error({ title: '错误', content: '已结束的策略不能再进行编辑了!' })
          return
        }
        // 赋值,显示编辑框
        this.editFormData.strategyId = straItem.id
        this.editFormData.open_price = straItem.open_price
        this.editFormData.close_price = straItem.close_price
        this.editFormData.profit = straItem.profit
        this.editFormData.is_running = straItem.is_running
        this.editFormData.note = straItem.note
        this.showEditModal = true
      }
    },

    // 确认修改投顾策略的内容
    confirmEditStrategy () {
      const reqData = {
        user_token: this.userToken,
        strategy_id: this.editFormData.strategyId,
        open_price: this.editFormData.open_price,
        close_price: this.editFormData.close_price,
        profit: this.editFormData.profit,
        is_running: this.editFormData.is_running,
        note: this.editFormData.note
      }
      this.modalEditLoading = true
      modifyOneStrategy(reqData).then(res => {
        // 刷新数据
        this.getCurrentStrategy()
        this.modalEditLoading = false
        this.showEditModal = false
        this.resetModalEdit()
      }).catch(err => {
        console.log(err)
      })
    },

    resetModalEdit () {
      this.$refs['modifyForm'].resetFields()
    },

    handleDelStrategy (straId) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认删除吗?删除将不可恢复!',
        closeable: true,
        onOk: () => {
          this.setCurStrategyIndexOf(straId)
          if (this.currentStraIndexOf !== -1) {
            // 发起删除请求
            deleteOneStrategy(straId, this.userToken).then(() => {
              // this.strategyList.splice(this.currentStraIndexOf, 1)
              // 重新刷新数据
              this.getCurrentStrategy()
              this.$Message.success('删除成功!')
              this.currentStraIndexOf = -1
            }).catch(err => {
              this.$Message.error(err.response.data.detail)
            })
          } else {}
        }
      })
    },

    pageChange (page) {
      this.currentPage = page
      this.getCurrentStrategy()
    },

    // 检索当前操作的item所在list的下标
    setCurStrategyIndexOf (straId) {
      this.strategyList.some((straItem, straIndex) => {
        if (straId === straItem.id) {
          this.currentStraIndexOf = straIndex
          return true
        } else {
          this.currentStraIndexOf = -1
        }
      })
    }
  }
}
</script>

<style scoped>
  .red{
    color: #ed4014;
  }
  .green{
    color: #19be6b;
  }
  .blue{
    color: #328EEE;
  }
  .strategy-content{
    color: #000c17;
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .strategy-note{
    color: #aaaaaa;
    font-size: 13px;
  }
  .slotAction{ text-align: right }
  .slotAction ul li{display: inline-block; padding: 6px;cursor: pointer}
  .slotAction ul li:not(:last-child):after{content:''; margin-left:12px;border: 1px solid #dddddd}
  .slotAction ul li:last-child{}
  .msg-author{
    width:45px;text-align:center;background-color:#b3cbf7;color:#ffffff;border-radius:3px;font-size:12px;
  }
  .stra-status{
    width:45px;text-align:center;background-color:#999999;color:#ffffff;border-radius:3px;font-size:8px;
  }
  .stra-status-runing{
    width:45px;text-align:center;color:#ffffff;border-radius:3px;font-size:8px;background-color:#cc4014;
  }
</style>
