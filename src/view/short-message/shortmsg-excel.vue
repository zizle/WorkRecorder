<style lang="less">
  @import "./common.less";
</style>
<template>
  <div>
    <Card title="EXCEL文件导入">
      <Row>
        <Upload
          ref="upload"
          type="drag"
          accept=".xls, .xlsx"
          action=""
          :before-upload="handleUploadExcel">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="54" style="color: #3399ff"></Icon>
              <p>点击或拖动文件到这里上传</p>
          </div>
        </Upload>
      </Row>
      <Row>
        <div>文件格式：后缀【xlsx】或【xls】的EXCEL合法文件。</div>
        <div>表格格式：Sheet名为【短讯通记录】字样，第一行为表头且各列为【日期，信息内容，类别，影响品种，备注】字样,其他列确保无内容。</div>
        <div style="color:#fb700d">特别注意：1. 第一列【日期】为日期格式。2. 要添加系统已存在的记录日期之前的数据需使用【手动添加】。</div>
        <div>错误排查：系统只会读取比当前已存在的数据日期大的数据行。例如：当前<span style="color:#fb700d">系统记录截止2020.12.01，上传只读2020.12.02及之后日期的记录。</span></div>
      </Row>
    </Card>
    <br>
    <Row v-if="uploadJoinTime" style="margin-bottom: 3px" type="flex" justify="end">
      <Button size="small" type="error" @click="delCurrentUpload" :loading="newAllDelLoading">全部删除</Button>
    </Row>
    <Row>
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
import { uploadExcel, delMessageRecord, delMsgWithJoinTime } from '@/api/short-message'
import { mapState } from 'vuex'
export default {
  name: 'upload-excel',
  data () {
    return {
      uploadServer: '',
      uploadWithData: {},
      uploadJoinTime: 0,
      dataShowStatus: '*暂无上传数据',
      newMsgList: [],
      delBtnLoading: false,
      newAllDelLoading: false
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
        this.uploadJoinTime = data.join_time // 将本次上传的时间赋值
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
    },
    // 删除所有当前上传
    delCurrentUpload () {
      if (this.uploadJoinTime > 0) {
        this.$Modal.confirm({
          title: '警告',
          content: '确认删除本次所有上传的数据条目吗？本次操作不可恢复!',
          closeable: true,
          onOk: () => {
            this.newAllDelLoading = true
            // 根据时间批量删除
            const reqData = {
              user_token: this.userToken,
              join_time: this.uploadJoinTime
            }
            delMsgWithJoinTime(reqData).then(res => {
              const data = res.data
              this.newMsgList = []
              this.dataShowStatus = '*暂无上传数据'
              this.$Message.success(data.message)
              this.newAllDelLoading = false
            }).catch(() => {
              this.$Message.error('删除失败了!')
            })
          }
        })
      } else {
        this.$Message.error('您还没上传短讯通数据!')
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
