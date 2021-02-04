<template>
<!--  非常规工作统计与记录查询,随登入用户的不同而显示不同的数据-->
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
        <Col :offset="isLeader? 1:0"><dateSetter ref="setDate"></dateSetter></Col>
        <Col><label><Input size="small" prefix="ios-search" placeholder="标题关键词辅助检索" v-model.trim="searchKeyWord"/></label></Col>
        <Col><Button size="small" type="primary" @click="queryAbnormal">查询</Button></Col>
      </Row>
    </Card>
<!--    统计表-->
    <div style="margin: 5px;color: #fd7c3c"><h4>我的非常规工作</h4></div>
    <Table
      border
      stripe
      size="small"
      :data="statisticsTableData"
      :columns="statisticsTableColumns"
    >
    </Table>
<!--    详情数据表-->
    <div style="margin: 5px;color: #fd7c3c"><h4>详细数据</h4></div>
    <Table
      border
      stripe
      size="small"
      :data="detailTableData"
      :columns="detailTableColumns"
    >
      <template slot-scope="{ row }" slot="otherInfo">
        <div style="color:#57a3f3;cursor: pointer" @click="showRowDetail(row)">详细</div>
      </template>
      <template slot-scope="{ row, index }" slot="actions">
        <div style="cursor: pointer">
          <span @click="toEditAbnormal(row, index)" style="margin-right: 2px;color:#2d8cf0">编辑</span> |
          <span @click="removeAbnormal(row, index)" style="margin-left: 2px;color: #ed4014">删除</span>
        </div>
      </template>
    </Table>
<!--    弹窗更多信息-->
    <Modal
      v-model="toShowOtherInfo"
      :width="60"
      :title="currentRowData.title"
      @on-visible-change="detailModalVisible"
    >
      <Row>
        <Col span="4">收入补贴：</Col><Col span="8" class="detail-content">{{currentRowData.allowance}}</Col>
        <Col span="4">主办方：</Col><Col span="8" class="detail-content">{{currentRowData.sponsor}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="4">申请者：</Col><Col span="8" class="detail-content">{{currentRowData.applicant}}</Col>
        <Col span="4">联系电话：</Col><Col span="8" class="detail-content">{{currentRowData.phone}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="4">工作类别：</Col><Col span="8" class="detail-content">{{currentRowData.task_type}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="4">备注：</Col><Col span="20" class="detail-content">{{currentRowData.note}}</Col>
      </Row>
      <br>
      <Row>
        <Col span="4">附件：</Col>
        <Col span="20" class="detail-content">
          <div v-if="currentRowData.annex"><a :href="currentRowData.annex_url" target="_blank">{{currentRowData.annex}}</a></div>
          <div v-else>无</div>
        </Col>
      </Row>
    </Modal>
<!--    弹窗编辑非常规工作-->
    <Modal
      v-model="toShowEdit"
      title="编辑记录"
      :loading="editLoading"
      :width="62"
      @on-ok="submitEditAbnormal"
    >
      <Form
        ref="editForm"
        label-position="left"
        :label-width="80"
        :model="currentRowData"
      >
        <Row :gutter="32">
          <Col span="12"><FormItem label="标题"><Input type="text" v-model="currentRowData.title"></Input></FormItem></Col>
          <Col span="12"><FormItem label="主办方"><Input type="text" v-model="currentRowData.sponsor"></Input></FormItem></Col>
        </Row>
        <Row :gutter="32">
          <Col span="12"><FormItem label="申请者"><Input type="text" v-model="currentRowData.applicant"></Input></FormItem></Col>
          <Col span="12"><FormItem label="联系电话"><Input type="text" v-model="currentRowData.phone"></Input></FormItem></Col>
        </Row>
        <Row :gutter="32">
          <Col span="12"><FormItem label="瑞币情况"><Input type="text" v-model="currentRowData.swiss_coin"></Input></FormItem></Col>
          <Col span="12"><FormItem label="合作者"><Input type="text" v-model="currentRowData.partner"></Input></FormItem></Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="评级得分">
              <Select v-model="currentRowData.score">
                <Option :value="5">5</Option>
                <Option :value="4">4</Option>
                <Option :value="3">3</Option>
                <Option :value="2">2</Option>
                <Option :value="1">1</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12"><FormItem label="收入补贴"><Input type="text" v-model="currentRowData.allowance"></Input></FormItem></Col>
        </Row>
        <Row :gutter="32">
          <Col><FormItem label="备注"><Input type="text" v-model="currentRowData.note"></Input></FormItem></Col>
        </Row>
        <Row :gutter="32">
          <Col><FormItem label="附件">
            <Upload
              action=""
              :before-upload="handleUploadAnnex"
              :default-file-list="selectedAnnexFile"
              :on-remove="removeSelectedFile">
              <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
            </Upload>
          </FormItem></Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dateToString } from '@/libs/util'
import { getAbnormalRecords, modifyAbnormal, deleteOneAbnormal } from '@/api/abnormal'
import StaffDrawer from '@/view/components/staff-drawer'
import dateSetter from '@/view/components/date-setter'
export default {
  name: 'abnormal',
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      systemUsers: state => state.user.systemUsers
    })
  },
  components: {
    StaffDrawer,
    dateSetter
  },
  data () {
    return {
      userGroupIds: [],
      checkedName: '',
      searchKeyWord: '',
      isShowStaff: false, //  是否显示人员选择框
      isNotInitData: true, // 数据是否初始化选项
      isLeader: false,

      statisticsTableData: [], // 统计表数据
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '数量', key: 'total_count', align: 'center' },
        { title: '瑞币', key: 'swiss_coin', align: 'center' },
        { title: '评级总分', key: 'score', align: 'center' }
      ],
      detailTableData: [], // 详情表数据
      detailTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '日期', key: 'create_time', align: 'center' },
        { title: '标题', key: 'title', align: 'center', minWidth: 120 },
        { title: '申请方', key: 'applicant', align: 'center' },
        { title: '评级得分', key: 'score', align: 'center' },
        {
          title: '是否有效',
          key: 'is_examined',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.is_examined ? '是' : '否')
          }
        },
        { title: '更多', align: 'center', width: 80, slot: 'otherInfo' },
        { title: '操作', align: 'center', width: 100, slot: 'actions' }
      ],

      toShowOtherInfo: false,
      toShowEdit: false,
      currentRowData: {},

      // 编辑记录
      selectedAnnexFile: [],
      annex_file: null,
      editLoading: false
    }
  },
  mounted () {
    this.getStartEndDate()
  },
  methods: {
    // 获取数据
    queryAbnormal () {
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
      getAbnormalRecords(params).then(res => {
        const data = res.data
        this.statisticsTableData = data.statistics
        this.detailTableData = data.records
        this.isNotInitData = false
      })
    },
    // 子组件传出抽屉显示的状态
    showStaffDrawerChanged (visible) {
      this.isShowStaff = visible
    },
    // 子组件传出选择的人员变化
    checkedStaffChanged (checkedStaffs, checkName, isLeader) {
      this.userGroupIds = checkedStaffs
      this.checkedName = checkName
      this.isLeader = isLeader
      if (this.userGroupIds.length > 0 && this.isNotInitData) {
        this.queryAbnormal() //  初始化数据
      }
    },

    // 获取开始日期和结束日期
    getStartEndDate () {
      const sDate = this.$refs.setDate.startDate
      const eDate = this.$refs.setDate.endDate
      return [dateToString(sDate), dateToString(eDate)]
    },

    // 显示行详细
    showRowDetail (rowData) {
      this.toShowOtherInfo = true
      this.currentRowData = rowData
    },
    // 编辑行
    toEditAbnormal (rowData, index) {
      this.currentRowData = rowData
      if (this.currentRowData.annex !== '') {
        this.selectedAnnexFile = [{ name: this.currentRowData.annex }]
      }
      this.toShowEdit = true
    },
    // 提交编辑行
    submitEditAbnormal () {
      this.editLoading = true
      const reqData = new FormData()
      const bodyData = {
        user_token: this.userToken,
        abnormal_id: this.currentRowData.id,
        title: this.currentRowData.title,
        allowance: this.currentRowData.allowance,
        sponsor: this.currentRowData.sponsor,
        applicant: this.currentRowData.applicant,
        phone: this.currentRowData.phone,
        swiss_coin: this.currentRowData.swiss_coin,
        partner: this.currentRowData.partner,
        score: this.currentRowData.score,
        note: this.currentRowData.note
      }
      reqData.append('body_data', JSON.stringify(bodyData))
      if (this.annex_file === null) {
      } else {
        reqData.append('annex_file', this.annex_file)
      }
      // 提交修改请求
      modifyAbnormal(reqData, this.currentRowData.id).then(res => {
        this.editLoading = false
        this.$Message.success('修改成功!')
        this.annex_file = null
        this.selectedAnnexFile = []
      }).catch(() => {
        this.editLoading = false
        this.$Message.error('修改失败了!')
        this.toShowEdit = true
      })
    },
    // 处理选择文件
    handleUploadAnnex (file) {
      this.annex_file = file
      this.selectedAnnexFile = [{ name: this.annex_file.name }]
      return false
    },
    // 清除文件
    removeSelectedFile () {
      this.selectedAnnexFile = []
      this.annex_file = null
    },
    // 删除行
    removeAbnormal (rowData, index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          deleteOneAbnormal(rowData.id, this.userToken).then(() => {
            this.detailTableData.splice(index, 1)
            this.$Message.success('删除成功!')
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
    },
    // 详情弹窗状态变化
    detailModalVisible (visible) {
      if (!visible) {
        this.currentRowData = {} // 清空当前缓存的数据
      }
    }
  }
}
</script>

<style scoped>
.detail-content{
  color: #3f8deb
}
</style>
