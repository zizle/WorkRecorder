<template>
<div>
  <Card>
    <Row :gutter="16" type="flex" justify="start" align="middle">
      <Col><span>开始日期:</span></Col>
      <Col><DatePicker v-model="startDate" size="small" style="width:110px" @on-change="startDateChanged"></DatePicker></Col>
      <Col><span>结束日期:</span></Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:110px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词段辅助检索" v-model="searchKeyWord"/></label></Col>
      <Col><Button size="small" type="primary" @click="handleParamsAndQuery">查询</Button></Col>
    </Row>
  </Card>
  <br>
  <Row>
    <List :header="dataShowStatus" border size="small" item-layout="vertical">
      <ListItem v-for="item in messageList" :key="item.id">
        <ListItemMeta :title="item.create_time" :description="item.audit_description" />
        <Row>
          <div style="font-size:14px">{{ item.content }}</div>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8"><div class="msg-author">{{ item.username }}</div></Col>
          <Col span="16">
            <div class="slotAction">
              <ul>
                <li style="color: #2d8cf0"  @click="handleEditMsg($event, item.id)">编辑</li>
                <li style="color: #ee1235" @click="handleDelMsg($event, item.id)">删除</li>
              </ul>
            </div>
          </Col>
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
import { getShortMessage, delMessageRecord } from '@/api/short-message'
import { formatDate } from '@/libs/util'
export default {
  name: 'shortmessage',
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      searchKeyWord: '',

      delBtnLoading: false,
      dataShowStatus: '这里空空,什么也没有！',
      messageList: [],
      totalMsgCount: 0,
      currentPage: 1,
      pageSize: 50
    }
  },
  watch: {
    messageList () {
      if (this.messageList.length > 0) {
        this.dataShowStatus = '我的短讯通'
      } else {
        this.dataShowStatus = '这里空空,什么也没有！'
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

    this.getCurrentMessage()
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
    handleParamsAndQuery () {
      this.currentPage = 1
      this.getCurrentMessage()
    },

    // 获取当前用户的短讯通记录
    getCurrentMessage () {
      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(this.endDate),
        page: this.currentPage,
        page_size: this.pageSize,
        keyword: this.searchKeyWord
      }
      getShortMessage(reqData).then(res => {
        const data = res.data
        this.messageList = data.messages
        this.totalMsgCount = data.total_count
      }).catch(err => {
        console.log(err)
      })
    },

    // 编辑一条短讯通
    handleEditMsg (e, itemId) {
      this.$Modal.info({
        title: '信息',
        content: '编辑功能暂未上线!'
      })
    },

    // 删除一条短讯通
    handleDelMsg (e, itemId) {
      // 获取id所在的数组下标
      let msgIndexOf = -1
      for (let i = 0; i < this.messageList.length; i++) {
        if (this.messageList[i].id === itemId) {
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
            delMessageRecord(itemId, this.userToken).then(() => {
              this.messageList.splice(msgIndexOf, 1)
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
    },

    pageChange (page) {
      this.currentPage = page
      this.getCurrentMessage()
    }

  }
}
</script>

<style scoped>
  .slotAction{ text-align: right }
  .slotAction ul li{display: inline-block; padding: 6px;cursor: pointer}
  .slotAction ul li:not(:last-child):after{content:''; margin-left:12px;border: 1px solid #dddddd}
  .slotAction ul li:last-child{}
  .msg-author{
    width:45px;text-align:center;background-color:#b3cbf7;color:#ffffff;border-radius:3px;
  }
</style>
