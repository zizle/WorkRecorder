<template>
<!--  非常规工作统计与记录查询,随登入用户的不同而显示不同的数据-->
  <div>
    <StaffDrawer :showStaffDrawer="isShowStaff"
                 @visibleChange="showStaffDrawerChanged"
                 @checkedChange="checkedStaffChanged"
    ></StaffDrawer>
    <Card>
      <button @click="showStaffChange">选择人员</button>
      <Button @click="queryAbnormal">查询</Button>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAbnormalRecords } from '@/api/abnormal'
import StaffDrawer from '@/view/components/staff-drawer'
export default {
  name: 'abnormal',
  computed: {
    ...mapState({
      systemUsers: state => state.user.systemUsers
    })
  },
  components: {
    StaffDrawer
  },
  data () {
    return {
      userGroupIds: [],
      isShowStaff: false, //  是否显示人员选择框
      isNotInitData: true
    }
  },
  mounted () {
  },
  methods: {
    // 获取数据
    queryAbnormal () {
      if (this.userGroupIds.length < 1) {
        this.$Modal.info({ title: '提示', content: '要查询的人员不能为空!' })
        return
      }
      const params = {
        currency: this.userGroupIds.toString(),
        start: '20201201',
        end: '20201231'
      }
      getAbnormalRecords(params).then(res => {
        console.log(res)
        this.isNotInitData = false
      })
    },

    // 主动改变抽屉的显示状态
    showStaffChange () {
      this.isShowStaff = true
    },
    // 子组件传出抽屉显示的状态
    showStaffDrawerChanged (visible) {
      this.isShowStaff = visible
    },
    // 子组件传出选择的人员变化
    checkedStaffChanged (checkedStaffs) {
      this.userGroupIds = checkedStaffs
      if (this.userGroupIds.length > 0 && this.isNotInitData) {
        this.queryAbnormal() //  初始化数据
      }
    }
  }
}
</script>

<style scoped>

</style>
