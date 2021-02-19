<template>
<!--    2020年的专题研究-->
  <div>
    <div style="margin: 5px;color: #fd7c3c"><h4>2020年专题研究记录({{monographicTableData.length}})</h4></div>
    <Table
      border
      size="small"
      :columns="monographicTableColumns"
      :data="monographicTableData"
    >
    </Table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMonographic } from '@/api/monographic'
export default {
  name: 'monographic',
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  mounted () {
    this.getMonographicArticle()
  },
  data () {
    return {
      monographicTableData: [],
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
      ]
    }
  },
  methods: {
    getMonographicArticle () {
      getMonographic(this.userToken).then(res => {
        const data = res.data
        this.monographicTableData = data.articles
      })
    }
  }
}
</script>

<style scoped>

</style>
