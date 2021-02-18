<template>
<!--  投资方案与记录查询,随登入用户的不同而显示不同的数据-->
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
import StaffDrawer from '@/view/components/staff-drawer'
import DateSetter from '@/view/components/date-setter'

export default {
  name: 'investment',
  components: {
    StaffDrawer,
    DateSetter
  },
  data () {
    return {
      isShowStaff: false,
      isNotInitData: true, // 数据是否初始化选项
      userGroupIds: [],
      checkName: '',
      searchKeyWord: '',
      isLeader: false
    }
  },
  methods: {
    queryDataRecords () {

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
    }
  }
}
</script>

<style scoped>

</style>
