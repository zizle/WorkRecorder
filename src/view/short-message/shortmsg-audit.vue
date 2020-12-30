<template>
<div>
  <Drawer title="全部人员" placement="left" v-model="showStaffDrawer">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAllStaff"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
    </div>
    <CheckboxGroup v-model="checkedStaff" @on-change="checkAllGroupChange">
      <List item-layout="vertical">
        <ListItem v-for="userItem in userList" :key="userItem.id">
          <Checkbox :label="userItem.id">{{userItem.username}}</Checkbox>
        </ListItem>
      </List>
    </CheckboxGroup>
  </Drawer>
  <Row :gutter="16" type="flex" justify="start" align="middle">
    <Col><Button type="info" size="small" @click="showStaffDrawer=true">选择人员</Button></Col>
    <Col><span>当前: {{ showCheckName }}</span></Col>
    <Col offset=1><span>开始日期:</span></Col>
    <Col><DatePicker v-model="startDate" size="small" style="width:110px" @on-change="startDateChanged"></DatePicker></Col>
    <Col><span>结束日期:</span></Col>
    <Col><DatePicker v-model="endDate" size="small" style="width:110px" @on-change="endDateChanged"></DatePicker></Col>
    <Col><Button size="small" type="primary" @click="queryCurrentMessage">查询</Button></Col>
  </Row>
  <Row>
    <List border size="small" item-layout="vertical">

    </List>
  </Row>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { getAuditShortMessage } from '@/api/short-message'
export default {
  name: 'shortmsg-audit',
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      allStaffId: [],

      showStaffDrawer: false,
      indeterminate: true,
      checkAllStaff: true,

      showCheckName: '全部',
      checkedStaff: [],

      page: 1,
      pageSize: 50
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      userList: state => state.user.systemUsers
    })
  },
  mounted () {
    const userIds = []
    this.userList.forEach(item => {
      if (!userIds.includes(item.id)) {
        userIds.push(item.id)
      }
    })
    this.allStaffId = userIds
    this.checkedStaff = this.allStaffId
    this.indeterminate = false
  },
  watch: {
    checkedStaff () {
      if (this.checkAllStaff) {
        this.showCheckName = '全部'
      } else {
        if (this.checkedStaff.length > 0) {
          this.userList.some(item => {
            if (item.id === this.checkedStaff[0]) {
              this.showCheckName = item.username + '等'
              return true
            }
          })
          if (this.checkedStaff.length === 1) {
            this.showCheckName = this.showCheckName.substr(0, this.showCheckName.length - 1)
          }
        } else {
          this.showCheckName = '不能不选'
        }
      }
    }
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

    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAllStaff = false
      } else {
        this.checkAllStaff = !this.checkAllStaff
      }
      this.indeterminate = false

      if (this.checkAllStaff) {
        this.checkedStaff = this.allStaffId
      } else {
        this.checkedStaff = []
      }
    },

    checkAllGroupChange (data) {
      if (data.length === this.allStaffId.length) {
        this.indeterminate = false
        this.checkAllStaff = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAllStaff = false
      } else {
        this.indeterminate = false
        this.checkAllStaff = false
      }
    },
    queryCurrentMessage () {
      let reqStaff = []
      if (this.checkAllStaff) {
        // console.log('当前全选')
      } else {
        if (this.checkedStaff.length === 0) {
          this.$Modal.error({ title: '错误', content: '至少需要选择一名人员进行查询!' })
          return
        }
        reqStaff = this.checkedStaff
      }
      console.log('当前人员:' + this.checkedStaff)
      console.log('开始日期:' + this.startDate)
      console.log('结束日期:' + this.endDate)

      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(this.endDate),
        req_staff: reqStaff,
        page: this.page,
        page_size: this.pageSize
      }
      getAuditShortMessage(reqData).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err.response)
      })
    }
  }
}
</script>

<style scoped>

</style>
