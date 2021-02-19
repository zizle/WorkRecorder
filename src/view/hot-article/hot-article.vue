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
        <Col><Button size="small" type="primary" @click="queryHotArticle">查询</Button></Col>
      </Row>
    </Card>
<!--统计表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>热点文章统计</h4></div>
    <Table
      size="small"
      highlight-row
      stripe
      border
      sum-text="合计"
      :show-summary="isLeader"
      :row-class-name="fixedRowHeight"
      :columns="statisticsTableColumns"
      :data="statisticsTableData"
      :loading="loadingStatistics"
    >
    </Table>
<!--    详细记录-->
    <div style="margin: 5px;color: #fd7c3c"><h4>详细记录({{detailTableData.length}})</h4></div>
    <Table
      border
      size="small"
      :columns="detailTableColumns"
      :data="detailTableData"
      :loading="loadingDetailRecords"
    >
      <template slot-scope="{ row }" slot="otherInfo">
        <div style="color:#57a3f3;cursor: pointer" @click="showRowDetail(row)">详细</div>
      </template>
      <template slot-scope="{ row, index }" slot="actions">
        <div style="cursor: pointer">
          <span @click="editArticle(index)" style="margin-right: 2px;color:#2d8cf0">编辑</span> |
          <span @click="removeArticle(index)" style="margin-left: 2px;color: #ed4014">删除</span>
        </div>
      </template>
    </Table>
<!--   弹窗显示文章的其他信息-->
  <Modal v-model="isShowRowDetail" class-name="detail-modal" title="文章的其他信息">
    <div>
      <Row>
        <Col span="8">稿件形式:</Col>
        <Col>{{ currentRowData.rough_type }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">收入补贴:</Col>
        <Col>{{ currentRowData.allowance }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">审核者:</Col>
        <Col>{{ currentRowData.checker }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">发表媒体:</Col>
        <Col>{{ currentRowData.media_name }}</Col>
      </Row>
      <br>
      <Row>
        <Col span="8">合作者:</Col>
        <Col>{{ currentRowData.partner }}</Col>
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
          <div v-if="currentRowData.annex"><a :href="currentRowData.annex_url" target="blank">{{currentRowData.annex}}</a></div>
          <div v-else>无</div>
        </Col>
      </Row>
    </div>
  </Modal>
<!-- 弹窗编辑非工作条目-->
  <Modal v-model="isShowEdit"
         :model="currentRowData"
         :width="60"
         title="编辑我的文章记录"
         @on-ok="submitEditArticle"
         :loading="modifyLoading">
    <Form ref="editFrom" :label-width="80">
      <Row>
        <Col span="12"><FormItem label="标题"><Input type="text" v-model="currentRowData.title"></Input></FormItem></Col>
        <Col span="12"><FormItem label="收入补贴"><Input type="number" v-model="currentRowData.allowance"></Input></FormItem></Col>
      </Row>
      <Row>
        <Col span="12"><FormItem label="审核者"><Input type="text" v-model="currentRowData.checker"></Input></FormItem></Col>
        <Col span="12"><FormItem label="发表媒体"><Input type="text" v-model="currentRowData.media_name"></Input></FormItem></Col>
      </Row>
      <Row>
        <Col span="12"><FormItem label="合作者"><Input type="text" v-model="currentRowData.partner"></Input></FormItem></Col>
        <Col span="12">
          <FormItem label="评级得分">
            <RadioGroup v-model="currentRowData.score">
              <Radio :label=5>5</Radio>
              <Radio :label=4>4</Radio>
              <Radio :label=3>3</Radio>
              <Radio :label=2>2</Radio>
              <Radio :label=1>1</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col><FormItem label="备注"><Input type="text" v-model="currentRowData.note"></Input></FormItem></Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="附件">
          <Upload
            action=""
            :before-upload="handleUploadAnnex"
            :default-file-list="selectedFile"
            :on-remove="removeSelectedFile">
            <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
          </Upload>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
  </div>
</template>

<script>
import { dateToString } from '@/libs/util'
import { getHotArticleRecords, deleteOneArticle, modifyHotArticle } from '@/api/hot-article'
import StaffDrawer from '@/view/components/staff-drawer'
import dateSetter from '@/view/components/date-setter'
import { mapState } from 'vuex'
export default {
  name: 'hot-article',
  components: {
    StaffDrawer,
    dateSetter
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  data () {
    return {
      isShowStaff: false,
      isLeader: false,
      isNotInitData: true,
      userGroupIds: [],
      checkedName: '',
      searchKeyWord: '',

      loadingStatistics: true,
      loadingDetailRecords: true,
      statisticsTableData: [],
      detailTableData: [],
      statisticsTableColumns: [
        { title: '姓名', key: 'username', align: 'center' },
        { title: '文章数量', key: 'total_count', align: 'center', sortable: true, sortType: 'desc' },
        { title: '总得分', key: 'sum_score', align: 'center', sortable: true }
      ],
      detailTableColumns: [
        { title: '发表日期', key: 'create_time', align: 'center' },
        { title: '作者', key: 'username', align: 'center', width: 80 },
        { title: '标题', key: 'title', align: 'center', minWidth: 120 },
        { title: '字数', key: 'words', align: 'center' },
        { title: '评级得分', key: 'score', align: 'center' },
        { title: '是否外发',
          key: 'is_publish',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.is_publish ? '是' : '否')
          }
        },
        { title: '其他', align: 'center', width: 80, slot: 'otherInfo' },
        { title: '操作', align: 'center', width: 100, slot: 'actions' }
      ],
      currentRowData: {},
      isShowEdit: false,
      annex_file: null,
      selectedFile: [],
      isShowRowDetail: false,
      modifyLoading: false
    }
  },
  watch: {
    isShowEdit () {
      if (!this.isShowEdit) {
        this.annex_file = null
        this.selectedFile = []
        this.currentRowData = {}
      }
    },
    isShowRowDetail () {
      if (!this.isShowRowDetail) {
        this.currentRowData = {}
      }
    }

  },
  methods: {
    // 查询数据
    queryHotArticle () {
      if (this.userGroupIds.length < 1) {
        this.$Modal.info({ title: '提示', content: '要查询的人员不能为空!' })
        return
      }
      this.setLoadingData(true)
      const seDates = this.getStartEndDate()
      const params = {
        currency: this.userGroupIds.toString(),
        start: seDates[0],
        end: seDates[1],
        kw: this.searchKeyWord
      }
      // 查询数据记录
      getHotArticleRecords(params).then(res => {
        const data = res.data
        this.statisticsTableData = data.statistics
        this.detailTableData = data.records.reverse()
        this.setLoadingData(false)
        this.isNotInitData = false
      })
    },
    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },
    // 编辑记录
    editArticle (index) {
      this.currentRowData = this.detailTableData[index]
      if (this.currentRowData.annex !== '') {
        this.selectedFile = [{ name: this.currentRowData.annex }]
      }
      this.isShowEdit = true
    },
    // 处理选择附件
    handleUploadAnnex (file) {
      this.annex_file = file
      this.selectedFile = [{ name: this.annex_file.name }]
      return false
    },
    // 移除已选的文件
    removeSelectedFile () {
      this.selectedFile = []
      this.annex_file = null
    },
    // 提交编辑结果
    submitEditArticle () {
      this.modifyLoading = true
      const reqData = new FormData()
      const bodyData = {
        user_token: this.userToken,
        article_id: this.currentRowData.id,
        title: this.currentRowData.title,
        media_name: this.currentRowData.media_name,
        checker: this.currentRowData.checker,
        allowance: this.currentRowData.allowance,
        partner: this.currentRowData.partner,
        score: this.currentRowData.score,
        note: this.currentRowData.note,
        is_publish: this.currentRowData.is_publish
      }
      reqData.append('body_data', JSON.stringify(bodyData))
      if (this.annex_file === null) {
      } else {
        reqData.append('annex_file', this.annex_file)
      }
      modifyHotArticle(reqData, this.currentRowData.id).then(res => {
        this.modifyLoading = false
        this.$Message.success('修改成功!')
        this.annex_file = null
        this.selectedFile = []
      }).catch(() => {
        this.modifyLoading = false
        this.$Message.error('修改失败了!')
      })
    },
    // 删除一个
    removeArticle (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          const currentItem = this.detailTableData[index]
          deleteOneArticle(currentItem.id, this.userToken).then(() => {
            this.detailTableData.splice(index, 1)
            this.$Message.success('删除成功!')
            // 刷新数据
            this.queryHotArticle()
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
    },
    // 设置下载状态
    setLoadingData (loading) {
      this.loadingStatistics = loading
      this.loadingDetailRecords = loading
    },
    // 获取开始日期和结束日期
    getStartEndDate () {
      const sDate = this.$refs.setDate.startDate
      const eDate = this.$refs.setDate.endDate
      return [dateToString(sDate), dateToString(eDate)]
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
        this.queryHotArticle() //  初始化数据
      }
    },
    // 固定表格高度
    fixedRowHeight (row, index) {
      return 'table-fixed-height'
    }
  }
}
</script>

<style>
  .table-fixed-height td{
    height: 28px;
  }

</style>
