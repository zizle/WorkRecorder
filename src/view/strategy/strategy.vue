<template>
<!--  投顾策略统计与记录查询,随登入用户的不同而显示不同的数据-->
  <div>
<!--    选择人员的左侧抽屉-->
    <StaffDrawer :showStaffDrawer="isShowStaff"
                 @visibleChange="showStaffDrawerChanged"
                 @checkedChange="checkedStaffChanged"
    ></StaffDrawer>
    <!--    查询条件卡-->
    <Card>
      <Row :gutter="16" type="flex" justify="start" align="middle">
        <Col v-if="isLeader"><Button type="info" size="small" @click="isShowStaff=true">选择人员</Button></Col>
        <Col v-if="isLeader">当前: <span style="color:#2886ff">{{ checkedName }}</span></Col>
        <Col :offset="isLeader? 1:0"><DateSetter ref="setDate"></DateSetter></Col>
        <Col><label><Input size="small" prefix="ios-search" placeholder="标题关键词辅助检索" v-model.trim="searchKeyWord"/></label></Col>
        <Col><Button size="small" type="primary" @click="queryDataRecords">查询</Button></Col>
      </Row>
    </Card>
<!--    统计表-->
    <div style="margin: 5px;color: #fd7c3c"><h4>投顾策略统计<span style="font-size: 12px;color: #999999">(运行中的策略不计入)</span></h4></div>
    <Table
      border
      stripe
      size="small"
      show-summary
      sum-text="合计"
      :loading="loadingStatistics"
      :row-class-name="fixedRowHeight"
      :data="statisticsTableData"
      :columns="statisticsTableColumns"
    >
    </Table>
<!--    详情数据-->
    <div style="margin: 5px;color: #fd7c3c"><h4>详细记录</h4></div>
    <List :header="listHeaderText" border size="small" item-layout="vertical">
    <ListItem v-for="item in detailListData" :key="item.id">
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
<!--    弹窗编辑开平仓和状态-->
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
import { dateToString } from '@/libs/util'
import { getStrategyRecords, deleteOneStrategy, modifyOneStrategy } from '@/api/strategy'
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'
import { mapState } from 'vuex'
export default {
  name: 'strategy',
  components: {
    StaffDrawer,
    DateSetter
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  data () {
    return {
      isShowStaff: false,
      isNotInitData: true, // 数据是否初始化选项
      userGroupIds: [],
      checkName: '',
      searchKeyWord: '',
      isLeader: false,
      loadingStatistics: true,
      loadingDetailRecords: true,

      statisticsTableData: [],
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '策略数量', key: 'total_count', align: 'center', sortable: true, sortType: 'desc' },
        { title: '成功数', key: 'success_count', align: 'center', sortable: true },
        { title: '成功率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.success_rate * 100).toFixed(2) + '%')
          }
        },
        { title: '累计收益额', key: 'sum_profit', align: 'center', sortable: true },
        { title: '累计收益率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.sum_profit_rate * 100).toFixed(2) + '%')
          }
        },
        { title: '平均收益率',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h('div', {}, (params.row.avg_profit_rate * 100).toFixed(2) + '%')
          }
        }
      ],

      listHeaderText: '没有查到数据记录',
      detailListData: [],

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
  watch: {
    detailListData () {
      if (this.detailListData.length < 1) {
        this.listHeaderText = '没有查到数据记录'
      } else {
        this.listHeaderText = ''
      }
    }
  },
  methods: {
    queryDataRecords () {
      if (this.userGroupIds.length < 1) {
        this.$Modal.info({ title: '提示', content: '要查询的人员不能为空!' })
        return
      }
      this.setLoadingData(true)
      const seDates = this.getStartEndDate()
      const params = {
        currency: this.userGroupIds.toString(),
        start: seDates[0],
        end: seDates[1],
        kw: this.searchKeyWord
      }
      // 查询数据记录
      getStrategyRecords(params).then(res => {
        const data = res.data
        this.statisticsTableData = data.statistics
        this.detailListData = data.records.reverse()
        this.setLoadingData(false)
        if (this.detailListData.length > 0) {
          this.listHeaderText = ''
        }
        this.isNotInitData = false
      })
    },
    // 设置加载状态
    setLoadingData (loading) {
      this.loadingStatistics = loading
      this.loadingDetailRecords = loading
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
        this.queryDataRecords()
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
    // 抽屉人员选择子组件传出抽屉显示的状态
    showStaffDrawerChanged (visible) {
      this.isShowStaff = visible
    },
    // 子组件传出选择的人员变化
    checkedStaffChanged (checkedStaffs, checkName, isLeader) {
      this.userGroupIds = checkedStaffs
      this.checkedName = checkName
      this.isLeader = isLeader
      if (this.userGroupIds.length > 0 && this.isNotInitData) {
        this.queryDataRecords() //  初始化数据
      }
    },
    // 获取开始日期和结束日期
    getStartEndDate () {
      const sDate = this.$refs.setDate.startDate
      const eDate = this.$refs.setDate.endDate
      return [dateToString(sDate), dateToString(eDate)]
    },
    // 编辑一条策略
    handleEditStrategy (straId) {
      this.setCurStrategyIndexOf(straId)
      if (this.currentStraIndexOf !== -1) {
        // 检测策略的状态
        const straItem = this.detailListData[this.currentStraIndexOf]
        if (!straItem.is_running && !this.isLeader) {
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
              this.queryDataRecords()
              this.$Message.success('删除成功!')
              this.currentStraIndexOf = -1
            }).catch(err => {
              this.$Message.error(err.response.data.detail)
            })
          } else {}
        }
      })
    },

    // 检索当前操作的item所在list的下标
    setCurStrategyIndexOf (straId) {
      this.detailListData.some((straItem, straIndex) => {
        if (straId === straItem.id) {
          this.currentStraIndexOf = straIndex
          return true
        } else {
          this.currentStraIndexOf = -1
        }
      })
    },

    fixedRowHeight (row, index) {
      return 'table-fixed-height'
    }
  }
}
</script>

<style>
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
  .table-fixed-height td{
    height: 28px;
  }
</style>
