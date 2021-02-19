<template>
  <div>
  <Card>
    <Row :gutter="16" type="flex" justify="start" align="middle">
<!--      查询选项-->
      <Col>开始日期:</Col>
      <Col><DatePicker v-model="startDate" size="small" style="width:115px" @on-change="startDateChanged"></DatePicker></Col>
      <Col>结束日期:</Col>
      <Col><DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker></Col>
      <Col><label><Input size="small" prefix="ios-search" placeholder="关键词段辅助检索" v-model="searchKeyWord" /></label></Col>
      <Col><Button size="small" type="primary" @click="handleQueryArticle">查询</Button></Col>
      <Col><Checkbox v-model="showSpecialArticle">2020年专题研究记录</Checkbox></Col>
    </Row>
  </Card>
    <!--    2020年专题信息显示表格-->
  <Row v-if="showSpecialArticle">
    <div style="margin: 5px;color: #fd7c3c"><h4>2020年我的专题研究</h4></div>
    <Table
      border
      size="small"
      :columns="monographicTableColumns"
      :data="monographicTableData"
    >
    </Table>
  </Row>

  <Row v-else>
<!--      结果表格-->
    <div style="margin: 5px;color: #fd7c3c"><h4>我的热点文章</h4></div>
    <Table
      border
      size="small"
      :row-class-name="fixedTableRowHeight"
      :columns="articleColumns"
      :data="articleList">
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
  </Row>
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
  <Modal v-model="isShowEdit" :model="currentRowData" title="编辑我的文章记录" @on-ok="submitEditArticle" :loading="modifyLoading">
    <Form ref="editFrom" :label-width="80">
      <FormItem label="标题">
        <Input type="text" v-model="currentRowData.title"></Input>
      </FormItem>
      <FormItem label="收入补贴">
        <Input type="number" v-model="currentRowData.allowance"></Input>
      </FormItem>
      <FormItem label="审核者">
        <Input type="text" v-model="currentRowData.checker"></Input>
      </FormItem>
      <FormItem label="发表媒体">
        <Input type="text" v-model="currentRowData.media_name"></Input>
      </FormItem>
      <FormItem label="合作者">
        <Input type="text" v-model="currentRowData.partner"></Input>
      </FormItem>
      <FormItem label="评级得分">
        <RadioGroup v-model="currentRowData.score">
          <Radio :label=5>5</Radio>
          <Radio :label=4>4</Radio>
          <Radio :label=3>3</Radio>
          <Radio :label=2>2</Radio>
          <Radio :label=1>1</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注">
        <Input type="text" v-model="currentRowData.note"></Input>
      </FormItem>
      <FormItem label="附件">
      <Upload
        action=""
        :before-upload="handleUploadAnnex"
        :default-file-list="selectedFile"
        :on-remove="removeSelectedFile">
        <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
      </Upload>
      </FormItem>
    </Form>
  </Modal>
  </div>
</template>

<script>
import { queryHotArticle, modifyHotArticle, deleteOneArticle } from '@/api/hot-article'
import { getMonographic } from '@/api/monographic'
import { formatDate } from '@/libs/util'
import { mapState } from 'vuex'
export default {
  name: 'article-my',
  mounted () {
    this.setCurrentRange()
    // 初始化数据
    this.getCurrentArticle()
    // 专题研究删除作者列
    if (this.isShowMonographicAuthor()) {
    } else {
      this.monographicTableColumns.splice(1, 1)
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      access: state => state.user.access,
      varietyList: state => state.variety.varietyList
    })
  },
  watch: {
    showSpecialArticle (newVal, oldVal) {
      if (newVal) {
        this.setSpecialYear()
        this.getMonographicArticle()
      } else {
        this.setCurrentRange()
      }
    }
  },
  data () {
    return {
      showSpecialArticle: false,
      monographicTableColumns: [
        {
          title: '日期',
          key: 'create_time',
          align: 'center'
        },
        {
          title: '作者',
          key: 'username',
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          minWidth: 200
        },
        {
          title: '字数',
          key: 'words',
          align: 'center'
        },
        {
          title: '评级得分',
          key: 'score',
          align: 'center'
        },
        {
          title: '附件',
          align: 'center',
          render: (h, params) => {
            let annexEle = null
            if (params.row.annex === '') {
              annexEle = h('div', {}, '无')
            } else {
              annexEle = h('a', {
                domProps: { href: params.row.annex_url, target: 'blank' }
              }, '下载')
            }
            return annexEle
          }
        }
      ],
      monographicTableData: [],

      startDate: new Date(),
      endDate: new Date(),
      searchKeyWord: '',

      articleColumns: [
        {
          title: '发表日期',
          key: 'create_time',
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          align: 'center',
          minWidth: 120
        },
        {
          title: '字数',
          key: 'words',
          align: 'center'
        },
        {
          title: '评级得分',
          key: 'score',
          align: 'center'
        },
        {
          title: '是否外发',
          key: 'is_publish',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.is_publish ? '是' : '否')
          }
        },
        {
          title: '其他',
          align: 'center',
          width: 80,
          slot: 'otherInfo'
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          slot: 'actions'
        }
      ],
      articleList: [],
      isShowRowDetail: false,
      isShowEdit: false,
      currentRowData: {},
      modifyLoading: false,
      annex_file: null,
      selectedFile: []
    }
  },
  methods: {
    setSpecialYear () {
      this.startDate = new Date(2020, 0, 1)
      this.endDate = new Date(2020, 11, 31)
    },
    setCurrentRange () {
      const cDate = new Date()
      cDate.setMonth(cDate.getMonth() - 1)
      this.startDate = cDate
      this.endDate = new Date()
    },
    isShowMonographicAuthor () {
      let show = false
      this.access.some((item, index) => {
        if (item === 'admin') {
          show = true
          return show
        } else {
          show = false
        }
      })
      return show
    },

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

    handleQueryArticle () {
      if (this.showSpecialArticle) {
        // 查询专题研究数据
        this.getMonographicArticle()
      } else {
        // 查询热点文章数据
        this.getCurrentArticle()
      }
    },
    getCurrentArticle () {
      const endDate = new Date()
      endDate.setFullYear(this.endDate.getFullYear())
      endDate.setMonth(this.endDate.getMonth())
      endDate.setDate(this.endDate.getDate() + 1) // 由于不包含this.endDate指定日期,所以+1
      const reqData = {
        user_token: this.userToken,
        start_date: formatDate(this.startDate),
        end_date: formatDate(endDate),
        is_audit: 0,
        keyword: ''
      }
      queryHotArticle(reqData).then(res => {
        const data = res.data
        this.articleList = data.articles
      }).catch(() => { this.$Message.error('获取数据失败了!') })
    },

    getMonographicArticle () {
      getMonographic(this.userToken).then(res => {
        const data = res.data
        this.monographicTableData = data.articles
      })
    },

    showRowDetail (rowData) {
      this.isShowRowDetail = true
      this.currentRowData = rowData
    },

    handleUploadAnnex (file) {
      this.annex_file = file
      this.selectedFile = [{ name: this.annex_file.name }]
      return false
    },

    removeSelectedFile () {
      this.selectedFile = []
      this.annex_file = null
    },

    editArticle (index) {
      this.currentRowData = this.articleList[index]
      if (this.currentRowData.annex !== '') {
        this.selectedFile = [{ name: this.currentRowData.annex }]
      }
      this.isShowEdit = true
    },

    removeArticle (index) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除这个记录吗?删除将不可恢复!',
        onOk: () => {
          const currentItem = this.articleList[index]
          deleteOneArticle(currentItem.id, this.userToken).then(() => {
            this.articleList.splice(index, 1)
            this.$Message.success('删除成功!')
          }).catch(() => {
            this.$Message.error('删除失败了!')
          })
        }
      })
    },
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
    fixedTableRowHeight () {
      return 'fixed-row-height'
    }
  }
}
</script>

<style>
  .ivu-table {
    color:#222222;
  }
  .fixed-row-height td{
    height: 30px;
  }
  .detail-modal{
    text-align: center;
  }
</style>
