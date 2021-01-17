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
      <Col><DatePicker v-model="startDate" size="small" style="width:115px" @on-change="startDateChanged"></DatePicker></Col>
      <Col><span>结束日期:</span></Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词段辅助检索" v-model="searchKeyWord"/></label></Col>
      <Col><Button size="small" type="primary" @click="handleParamsAndQuery">查询</Button></Col>
    </Row>
  </Card>
  <br>
  <Table
    border
    size="small"
    :columns="tableColumns" :data="userAbnormalWork">
    <template slot-scope="{ row }" slot="otherInfo">
      <div style="color:#57a3f3;cursor: pointer" @click="showRowDetail(row)">详细</div>
    </template>
    <template slot-scope="{ row }" slot="editScore">
      <div v-if="editScoreId === row.id" style="display: table-cell">
        <Input v-model="editScore" size="small" style="width:40px;text-align: center" /> <span style="cursor: pointer;margin-left: 5px"><span @click="saveEditScore(row)">保存</span> | <span @click="cancelEditScore">取消</span></span>
      </div>
      <div v-else style="vertical-align: middle">
        <span>{{ row.score }}</span><span style="float: right;cursor:pointer"><Icon size="15" color="#2d8cf0" type="md-create" @click="toEditScore(row)" /></span>
      </div>
    </template>

    <template slot-scope="{ row }" slot="editExamined">
      <div v-if="editExaminedId === row.id" style="display: table-cell">
        <Select v-model="editExaminedValue" size="small" style="width: 60px">
          <Option :value="1">是</Option>
          <Option :value="0">否</Option>
        </Select><span style="cursor: pointer;margin-left: 5px"><span @click="saveEditExamined(row)">保存</span> | <span @click="cancelEditExamined">取消</span></span>
      </div>
      <div v-else style="vertical-align: middle">
        <span>{{row.is_examined?'是':'否'}}</span><span style="float: right;cursor:pointer"><Icon size="15" color="#2d8cf0" type="md-create" @click="toEditExamined(row)" /></span>
      </div>
    </template>
  </Table>

<!--   弹窗显示工作的其他信息-->
  <Modal v-model="isShowRowDetail" class-name="detail-modal" title="工作其他信息">
    <div>
      <Row>
        <Col span="8">收入补贴:</Col>
        <Col>{{ currentRowData.allowance }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">主办方:</Col>
        <Col>{{ currentRowData.sponsor }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">申请者:</Col>
        <Col>{{ currentRowData.applicant }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">联系电话:</Col>
        <Col>{{ currentRowData.phone }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">工作类别:</Col>
        <Col>{{ currentRowData.task_name }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">备注:</Col>
        <Col>{{ currentRowData.note }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">附件:</Col>
        <Col>
          <div v-if="currentRowData.annex"><a :href="currentRowData.annex_url">{{currentRowData.annex}}</a></div>
          <div v-else>无</div>
        </Col>
      </Row>
    </div>
  </Modal>
</div>
</template>

<script>
import { queryAbnormal, auditAbnormal } from '@/api/abnormal'
import { formatDate } from '@/libs/util'
import { mapState } from 'vuex'
export default {
  name: 'abnormal-audit',
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      userList: state => state.user.systemUsers
    })
  },
  data () {
    return {
      startDate: new Date(),
      endDate: new Date(),
      allStaffId: [],
      searchKeyWord: '',

      indeterminate: true,
      checkAllStaff: true,

      showStaffDrawer: false,
      showCheckName: '全部',
      checkedStaff: [],

      userAbnormalWork: [],
      tableColumns: [
        {
          title: '姓名',
          key: 'username',
          align: 'center'
        },
        {
          title: '日期',
          key: 'create_time',
          align: 'center'
        },
        {
          title: '工作',
          key: 'title',
          align: 'center',
          minWidth: 120
        },
        {
          title: '评级得分',
          align: 'center',
          slot: 'editScore'
        },
        {
          title: '有效',
          align: 'center',
          slot: 'editExamined'
        },
        {
          title: '其他',
          align: 'center',
          width: 80,
          slot: 'otherInfo'
        }
      ],

      isShowRowDetail: false,
      currentRowData: {},

      editScoreId: '',
      editScore: '',

      editExaminedId: '',
      editExaminedValue: ''
    }
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
    this.queryCurrentAbnormalWork()
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
    },
    isShowRowDetail () {
      if (!this.isShowRowDetail) {
        this.currentRowData = {}
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
      this.queryCurrentAbnormalWork()
    },

    queryCurrentAbnormalWork () {
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

        keyword: this.searchKeyWord,
        req_staff: reqStaff,
        is_audit: 1
      }
      queryAbnormal(reqData).then(res => {
        const data = res.data
        this.userAbnormalWork = data.abnormal_works
        //   this.userMsgList = data.messages
        //   this.totalMsgCount = data.total_count
        //   if (this.userMsgList.length > 0) {
        //     this.dataShowStatus = '检索到以下结果(注意:数据或有分页)'
        //   } else {
        //     this.dataShowStatus = '没有查询到相关数据!'
        //   }
        // }).catch(() => {
        //   this.dataShowStatus = '查询出错,没有查询到相应数据!'
        //   this.userMsgList = []
      })
    },
    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },

    toEditScore (rowData) {
      this.editScore = rowData.score
      this.editScoreId = rowData.id
    },

    toEditExamined (rowData) {
      this.editExaminedId = rowData.id
      this.editExaminedValue = rowData.is_examined
    },
    cancelEditScore () {
      this.editScoreId = ''
      this.editScore = ''
    },
    cancelEditExamined () {
      this.editExaminedId = ''
      this.editExaminedValue = ''
    },
    saveEditScore (rowData) {
      // 发起修改请求
      if (this.editScore < 1) {
        this.$Modal.error({ title: '错误', content: '分数值需大于0的整数!' })
        return
      }
      if (this.editScore > 5) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定设置大于5分的分数吗？',
          onOk: () => {
            this.putRequestModify(rowData, this.editScore, rowData.is_examined)
          }
        })
      } else {
        this.putRequestModify(rowData, this.editScore, rowData.is_examined)
      }
    },

    saveEditExamined (rowData) {
      // 保存有效与否
      this.putRequestModify(rowData, rowData.score, this.editExaminedValue)
    },

    putRequestModify (rowData, score, examined) {
      const reqData = {
        user_token: this.userToken,
        abnormal_id: rowData.id,
        score: score,
        is_examined: examined
      }
      auditAbnormal(reqData, rowData.id).then(res => {
        rowData.score = res.data.score
        rowData.is_examined = res.data.is_examined
        this.editScoreId = ''
        this.editScore = ''
        this.editExaminedId = ''
        this.editExaminedValue = ''
        this.$Message.success('操作成功!')
      }).catch(() => { this.$Message.error('操作失败!') })
    }

  }
}
</script>

<style>

</style>
