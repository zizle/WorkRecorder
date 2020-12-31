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

  <Card>
    <Row :gutter="16" type="flex" justify="start" align="middle">
      <Col><Button type="info" size="small" @click="showStaffDrawer=true">选择人员</Button></Col>
      <Col><span>当前: {{ showCheckName }}</span></Col>
      <Col offset=1><span>开始日期:</span></Col>
      <Col><DatePicker v-model="startDate" size="small" style="width:110px" @on-change="startDateChanged"></DatePicker></Col>
      <Col><span>结束日期:</span></Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:110px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词辅助检索" v-model="searchKeyWord"/></label></Col>
      <Col><Button size="small" type="primary" @click="handleParamsAndQuery">查询</Button></Col>
  </Row>
  </Card>
  <br>
  <Row>
    <List border :header="dataShowStatus" size="small" item-layout="vertical">
      <ListItem v-for="item in userMsgList" :key="item.id">
        <ListItemMeta :title="item.create_time" :description="item.audit_description" />
        <div style="font-size:15px">{{ item.content }}</div>
        <Row type="flex" justify="end" align="middle" :gutter="8">
              <Col span="1" pull="20"><div class="msg-author">{{item.username}}</div></Col>
              <div v-if="editAudit === item.id">
                  <Col span="12">
                    <label>
                      <Select size='small' style="width: 100px" :value="item.audit_mind" @on-change="currentAuditChanged">
                        <Option :value=0>正常</Option>
                        <Option :value=1>编写有误</Option>
                        <Option :value=2>敏感词汇</Option>
                        <Option :value=3>遭遇投诉</Option>
                        <Option :value=4>其他问题</Option>
                      </Select>
                    </label>
                  </Col>
                  <Col span="5"><Button size='small' type="info" @click="saveAudit(item.id)">保存</Button></Col>
                  <Col span="5"><Button size='small' @click="editAudit = -1">取消</Button></Col>
              </div>
              <div v-else>
                <Col span="12"><Button size='small' @click="handleAudit(item.id)" type="primary">批注</Button></Col>
                <Col span="12"><Button size='small' @click="auditDelMessage(item.id)" type="error" :loading="delBtnLoading">删除</Button></Col>
              </div>
            </Row>
      </ListItem>
    </List>
  </Row>
  <Row style="text-align: right">
    <Page  :total="totalMsgCount" :page-size="pageSize" @on-change="pageChange" show-total />
  </Row>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { formatDate } from '@/libs/util'
import { getAuditShortMessage, updateMsgAuditMind, delMessageRecord } from '@/api/short-message'
export default {
  name: 'shortmsg-audit',
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      allStaffId: [],
      searchKeyWord: '',

      showStaffDrawer: false,
      indeterminate: true,
      checkAllStaff: true,

      showCheckName: '全部',
      checkedStaff: [],

      page: 1,
      pageSize: 40,

      dataShowStatus: '选择条件进行搜索数据',
      userMsgList: [],
      totalMsgCount: 0,

      editAudit: -1,
      currentAudit: 0,
      currentMsgIndexOf: -1,

      delBtnLoading: false
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      userList: state => state.user.systemUsers
    })
  },
  mounted () {
    const cDate = new Date(this.startDate)
    cDate.setMonth(cDate.getMonth() - 1)
    this.startDate = cDate

    const userIds = []
    this.userList.forEach(item => {
      if (!userIds.includes(item.id)) {
        userIds.push(item.id)
      }
    })
    this.allStaffId = userIds
    this.checkedStaff = this.allStaffId
    this.indeterminate = false

    // 默认请求数据
    this.queryCurrentMessage()
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

    handleParamsAndQuery () {
      this.page = 1
      this.queryCurrentMessage()
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

      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(this.endDate),
        req_staff: reqStaff,
        page: this.page,
        page_size: this.pageSize,
        keyword: this.searchKeyWord
      }
      getAuditShortMessage(reqData).then(res => {
        const data = res.data
        this.userMsgList = data.messages
        this.totalMsgCount = data.total_count
        if (this.userMsgList.length > 0) {
          this.dataShowStatus = '检索到以下结果(注意:数据或有分页)'
        } else {
          this.dataShowStatus = '没有查询到相关数据!'
        }
      }).catch(() => {
        this.dataShowStatus = '查询出错,没有查询到相应数据!'
        this.userMsgList = []
      })
    },

    pageChange (page) {
      this.page = page
      this.queryCurrentMessage()
    },

    handleAudit (msgId) {
      // 隐藏批注按钮,显示批注操作
      this.editAudit = msgId
      // 设置当前要保存的选项值this.currentAudit为当前条目的选项值
      this.setCurMsgIndexOf(this.editAudit)
      if (this.currentMsgIndexOf === -1) {
        this.$Modal.info({ title: '错误', content: '内部出现一个未知错误!无法继续。' })
        this.editAudit = -1
        return
      }
      this.currentAudit = this.userMsgList[this.currentMsgIndexOf].audit_mind
    },

    currentAuditChanged (auditVal) {
      this.currentAudit = auditVal
    },

    saveAudit (msgId) {
      // 请求修改批注意见
      const reqData = {
        user_token: this.userToken,
        audit_mind: this.currentAudit
      }
      updateMsgAuditMind(reqData, msgId).then(res => {
        const data = res.data
        const msgObj = this.userMsgList[this.currentMsgIndexOf]
        msgObj.audit_description = data.audit_description
        msgObj.audit_mind = data.audit_mind
        this.currentMsgIndexOf = -1
        this.editAudit = -1
        this.$Message.success('操作成功!')
      }).catch(() => {
        this.$Message.error('操作失败了!')
      })
    },

    // 检索当前操作的item所在list的下标
    setCurMsgIndexOf (msgId) {
      this.userMsgList.some((msgItem, msgIndex) => {
        if (msgId === msgItem.id) {
          this.currentMsgIndexOf = msgIndex
          return true
        }
      })
    },

    auditDelMessage (msgId) {
      this.$Modal.confirm({
        title: '警告',
        content: '确认删除吗？删除将不可恢复!',
        closeable: true,
        onOk: () => {
          this.delBtnLoading = true
          this.setCurMsgIndexOf(msgId)
          delMessageRecord(msgId, this.userToken).then(() => {
            this.userMsgList.splice(this.currentMsgIndexOf, 1)
            this.$Message.success('删除成功!')
            this.delBtnLoading = false
            this.totalMsgCount -= 1
          }).catch((err) => {
            this.$Message.error(err.response.data.detail)
            this.delBtnLoading = false
          })
        }
      })
    }

  }
}
</script>

<style scoped>
/*.slotAction{ text-align: right }*/
  .msg-author{
    width:45px;text-align:center;background-color:#b3cbf7;color:#ffffff;border-radius:3px;
  }
</style>
