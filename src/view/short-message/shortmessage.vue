<template>
<div>
  <Row>
    <List :header="dataShowStatus" border size="large" item-layout="vertical">
      <ListItem v-for="item in messageList" :key="item.id">
        <h3>{{item.create_time}}</h3>
        <div>{{ item.content }}</div>
        <template slot="extra">
         <Button type="error" size="small" :loading="delBtnLoading" data-msgid="item.id" @click="handleDelMsg($event, item.id)">删除</Button>
        </template>
      </ListItem>
    </List>
  </Row>
  <Row class="paginator">
    <Page  :total="totalMsgCount" :page-size="pageSize" @on-change="pageChange" show-total />
  </Row>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserShortMessage, delMessageRecord } from '@/api/short-message'
export default {
  name: 'shortmessage',
  data () {
    return {
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
        this.dataShowStatus = ''
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
    this.getCurrentMessage()
  },
  methods: {
    // 获取当前用户的短讯通记录
    getCurrentMessage () {
      getUserShortMessage(this.userToken, this.currentPage, this.pageSize).then(res => {
        const data = res.data
        this.messageList = data.messages
        this.totalMsgCount = data.total_count
      }).catch(err => {
        console.log(err)
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
            }).catch(() => {
              this.$Message.error('删除失败!')
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
.paginator{text-align: right}
</style>
