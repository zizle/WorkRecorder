<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="导入短讯通EXCEL">
      <Row>
        <Upload
          ref="upload"
          type="drag"
          accept=".xls, .xlsx"
          action=""
          :before-upload="handleUploadExcel">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖动文件到这里上传</p>
          </div>
        </Upload>
      </Row>
    </Card>
    <Row class="margin-top-10">
      <List :header="dataShowStatus" border size="large" item-layout="vertical">
        <ListItem v-for="item in newMsgList" :key="item.id">
          <h3>{{item.create_time}}</h3>
            {{ item.content }}
          <template slot="extra">
           <Button type="error" size="small" :loading="delBtnLoading" data-msgid="item.id" @click="handleDelMsg($event, item.id)">删除</Button>
          </template>
        </ListItem>
      </List>
    </Row>
  </div>
</template>
<script>
import { uploadExcel, delMessageRecord } from '@/api/short-message'
import { mapState } from 'vuex'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadServer: '',
      uploadWithData: {},
      dataShowStatus: '*暂无数据',
      newMsgList: [],
      delBtnLoading: false
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  watch: {
    newMsgList () {
      if (this.newMsgList.length > 0) {
        this.dataShowStatus = '本次新增'
      } else {
        this.dataShowStatus = '*暂无数据'
      }
    }
  },
  methods: {
    handleUploadExcel (file) {
      const formData = new FormData()
      formData.append('excel_file', file)
      formData.append('user_token', this.userToken)
      uploadExcel(formData).then(res => {
        const data = res.data
        // 将返回的数据展示到表格中
        this.$Modal.success(
          {
            title: '成功',
            content: data.message
          }
        )
        // 数据显示到列表中
        this.newMsgList = data.messages
      }).catch(err => {
        this.$Modal.error({
          title: '错误',
          content: err.response.data.detail
        })
      })
      return false
    },
    handleDelMsg (e, itemId) {
      // 获取id所在的数组下标
      let msgIndexOf = -1
      for (let i = 0; i < this.newMsgList.length; i++) {
        if (this.newMsgList[i].id === itemId) {
          msgIndexOf = i
          break
        }
      }
      if (msgIndexOf !== -1) {
        // 提示确认删除
        this.$Modal.confirm({
          title: '警告',
          content: '确认删除吗？删除将不可恢复,且有可能无法再通过批量方式重新上传此条数据!',
          closeable: true,
          onOk: () => {
            this.delBtnLoading = true
            delMessageRecord(itemId, this.userToken).then(() => {
              this.newMsgList.splice(msgIndexOf, 1)
              this.$Message.success('删除成功!')
              this.delBtnLoading = false
            }).catch(() => {
              this.$Message.error('删除失败!')
              this.delBtnLoading = false
            })
          }
        })
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
