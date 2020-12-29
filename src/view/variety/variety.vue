<template>
  <div>
    <Checkbox-group v-model="tableRowsChecked" @on-change="changeTableRows">
        <Checkbox label="金融股指">金融股指</Checkbox>
        <Checkbox label="农业产品">农业产品</Checkbox>
        <Checkbox label="能源化工">能源化工</Checkbox>
        <Checkbox label="金属产业">金属产业</Checkbox>
        <Checkbox label="中国金融期货交易所">中金所</Checkbox>
        <Checkbox label="郑州商品交易所">郑商所</Checkbox>
        <Checkbox label="大连商品交易所">大商所</Checkbox>
        <Checkbox label="上海期货交易所">上期所</Checkbox>
    </Checkbox-group>
    <Table stripe :columns="varietyTableColumns" :data="varietyListShow"></Table>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      varietyTableColumns: [
        {
          title: '品种',
          key: 'variety_name'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '最近更新',
          key: 'update_time'
        },
        {
          title: '交易代码',
          key: 'variety_en',
          sortable: true,
          sortType: 'asc'
        },
        {
          title: '组别',
          key: 'group_name'
        },
        {
          title: '交易所',
          key: 'exchange_name'
        }
      ],
      tableRowsChecked: ['金融股指', '农业产品', '能源化工', '金属产业',
        '中国金融期货交易所', '郑州商品交易所', '大连商品交易所', '上海期货交易所'],
      varietyListShow: []
    }
  },
  computed: {
    ...mapState({
      varietyList: state => state.variety.varietyList
    })
  },
  mounted () {
    this.varietyListShow = this.varietyList
  },
  methods: {
    ...mapActions([
    ]),
    showVarieties () {
      console.log(this.varietyList)
    },
    changeTableRows () {
      let data = []
      this.tableRowsChecked.forEach(row => {
        this.varietyList.forEach(item => {
          if (item.group_name === row || item.exchange_name === row) {
            data.push(item)
          }
        })
      })
      this.varietyListShow = data
    }
  }
}
</script>

<style>
</style>
