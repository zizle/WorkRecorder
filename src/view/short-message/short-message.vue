<template>
<!--  短讯通统计与记录查询,随登入用户的不同而显示不同的数据-->
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
    <div style="margin: 5px;color: #fd7c3c"><h4>短讯通统计</h4></div>
    <Table
      border
      stripe
      size="small"
      sum-text="合计"
      :show-summary="isLeader"
      :loading="loadingStatistics"
      :row-class-name="fixedRowHeight"
      :data="statisticsTableData"
      :columns="statisticsTableColumns"
    >
    </Table>
<!--    详情数据-->
    <div style="margin: 5px;color: #fd7c3c"><h4>详细记录({{detailListData.length}})</h4></div>
    <List :header="listHeaderText" border size="small" item-layout="vertical" :loading="loadingDetailRecords">
      <ListItem v-for="item in detailListData" :key="item.id">
        <ListItemMeta :title="item.create_time" :description="item.audit_description" />
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
import { getShortMsgRecords, delMessageRecord } from '@/api/short-message'
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'
import { mapState } from 'vuex'
export default {
  name: 'short-message',
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
      statisticsTableData: [], // 统计表格数据
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '数量', key: 'total_count', align: 'center', sortable: true, sortType: 'desc' },
        { title: '标记数', key: 'audit_count', align: 'center', sortable: true }
      ], // 统计表格字段,

      listHeaderText: '没有查到数据记录',
      loadingDetailRecords: true,
      detailListData: []
    }
  },
  methods: {
    // 根据设置的条件获取数据记录
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
      getShortMsgRecords(params).then(res => {
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

    // 编辑短讯通
    handleEditMsg (msgId) {
      this.$Modal.info({
        title: '信息',
        content: '编辑功能暂未上线!'
      })
    },
    // 删除短讯通
    handleDelMsg (msgId) {
      // 获取id所在的数组下标
      let msgIndexOf = -1
      for (let i = 0; i < this.detailListData.length; i++) {
        if (this.detailListData[i].id === msgId) {
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
            delMessageRecord(msgId, this.userToken).then(() => {
              this.detailListData.splice(msgIndexOf, 1)
              this.$Message.success('删除成功!')
              this.queryDataRecords()
            }).catch((err) => {
              this.$Message.error(err.response.data.detail)
            })
          }
        })
      }
    },

    setLoadingData (loading) {
      this.loadingStatistics = loading
      this.loadingDetailRecords = loading
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
