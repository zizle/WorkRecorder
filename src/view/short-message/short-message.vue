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
  </div>
</template>

<script>
import { dateToString } from '@/libs/util'
import { getShortMsgRecords } from '@/api/short-message'
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'
export default {
  name: 'short-message',
  components: {
    StaffDrawer,
    DateSetter
  },
  data () {
    return {
      isShowStaff: false,
      userGroupIds: [],
      checkName: '',
      searchKeyWord: '',
      isLeader: false
    }
  },
  methods: {
    // 根据设置的条件获取数据记录
    queryDataRecords () {
      if (this.userGroupIds.length < 1) {
        this.$Modal.info({ title: '提示', content: '要查询的人员不能为空!' })
        return
      }
      const seDates = this.getStartEndDate()
      const params = {
        currency: this.userGroupIds.toString(),
        start: seDates[0],
        end: seDates[1],
        kw: this.searchKeyWord
      }
      // 查询数据记录
      getShortMsgRecords(params).then(res => {
        console.log(res)
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
      // if (this.userGroupIds.length > 0 && this.isNotInitData) {
      //   this.queryAbnormal() //  初始化数据
      // }
    }
  }
}
</script>

<style scoped>

</style>
