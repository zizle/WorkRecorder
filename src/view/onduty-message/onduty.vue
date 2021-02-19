<template>
<!--  值班信息统计与记录查询,随登入用户的不同而显示不同的数据-->
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
<!--  统计表-->
  <div style="margin: 5px;color: #fd7c3c"><h4>值班信息统计</h4></div>
  <Table
    size="small"
    highlight-row
    stripe
    border
    sum-text="合计"
    :show-summary="isLeader"
    :row-class-name="fixedRowHeight"
    :columns="statisticsTableColumns"
    :data="statisticsTableData"
    :loading="loadingStatistics">
  </Table>
<!--    详情数据-->
  <div style="margin: 5px;color: #fd7c3c"><h4>详细记录({{detailListData.length}})</h4></div>
  <List :header="listHeaderText" border size="small" item-layout="vertical">
    <ListItem v-for="item in detailListData" :key="item.id">
      <div><h3>{{item.create_time}}</h3></div>
      <Row>
        <div style="font-size:14px">{{ item.content }}</div>
      </Row>
      <Row type="flex" align="middle">
        <Col span="8"><div class="msg-author">{{ item.username }}</div></Col>
        <Col span="16">
          <div class="slotAction">
            <ul>
              <li style="color: #2d8cf0"  @click="handleEditMsg(item.id)">编辑</li>
              <li style="color: #ee1235" @click="handleDelMsg(item.id)">删除</li>
            </ul>
          </div>
        </Col>
      </Row>
    </ListItem>
  </List>
</div>
</template>

<script>
import { dateToString } from '@/libs/util'
import { getOndutyMsgRecords, delOndutyMessageRecord } from '@/api/onduty-message'
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'
import { mapState } from 'vuex'
export default {
  name: 'onduty',
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
      isLeader: false,
      isShowStaff: false,
      isNotInitData: true,
      userGroupIds: [],
      checkedName: '',
      searchKeyWord: '',

      loadingStatistics: true,
      loadingDetailRecords: true,
      listHeaderText: '没有查到数据记录',
      statisticsTableData: [],
      detailListData: [],
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '数量', key: 'total_count', align: 'center', sortable: true, sortType: 'desc' }
      ],

      delBtnLoading: false
    }
  },
  methods: {
    // 查询记录
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
      getOndutyMsgRecords(params).then(res => {
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
    // 编辑值班记录
    handleEditMsg (msgId) {
      this.$Modal.info({
        title: '信息',
        content: '编辑功能暂未上线!'
      })
    },
    // 删除一条值班信息
    handleDelMsg (itemId) {
      // 获取id所在的数组下标
      let msgIndexOf = -1
      for (let i = 0; i < this.detailListData.length; i++) {
        if (this.detailListData[i].id === itemId) {
          msgIndexOf = i
          break
        }
      }
      if (msgIndexOf !== -1) {
        // 提示确认删除
        this.$Modal.confirm({
          title: '警告',
          content: '确认删除吗？删除将不可恢复!',
          closeable: true,
          onOk: () => {
            this.delBtnLoading = true
            delOndutyMessageRecord(itemId, this.userToken).then(() => {
              this.detailListData.splice(msgIndexOf, 1)
              this.$Message.success('删除成功!')
              this.delBtnLoading = false
              // 刷新数据
              this.queryDataRecords()
            }).catch((err) => {
              this.$Message.error(err.response.data.detail)
              this.delBtnLoading = false
            })
          }
        })
      }
    },
    // 设置加载状态
    setLoadingData (loading) {
      this.loadingStatistics = loading
      this.loadingDetailRecords = loading
    },
    // 获取开始日期和结束日期
    getStartEndDate () {
      const sDate = this.$refs.setDate.startDate
      const eDate = this.$refs.setDate.endDate
      return [dateToString(sDate), dateToString(eDate)]
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

    fixedRowHeight (row, index) {
      return 'table-fixed-height'
    }
  }
}
</script>

<style>
  .slotAction{ text-align: right }
  .slotAction ul li{display: inline-block; padding: 6px;cursor: pointer}
  .slotAction ul li:not(:last-child):after{content:''; margin-left:12px;border: 1px solid #dddddd}
  .slotAction ul li:last-child{}
  .msg-author{
    width:45px;text-align:center;background-color:#b3cbf7;color:#ffffff;border-radius:3px;font-size:10px;
  }
  .table-fixed-height td{
    height: 28px;
  }
</style>
