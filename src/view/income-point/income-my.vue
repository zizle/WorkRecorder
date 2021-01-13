<template>
<div>
  <div style="margin: 5px;color: #fd7c3c"><h4>我的客户列表</h4></div>
  <Table border size="small" :data="userCustomerList" :columns="customerColumns">
    <template slot-scope="{ row }" slot="detail">
      <Button type="primary" size="small" @click="showCustomerDetail(row)">查询</Button>
    </template>
  </Table>
  <br>
  <div style="margin: 5px;color: #fd7c3c"><h4>客户 <span style="color: #1890ff">{{ currentCustomerName }}</span> 权益明细</h4></div>
  <Table border size="small" :data="customerIndexes" :columns="customerIndexColumns">
    <template slot-scope="{ row, index }" slot="actions">
        <div style="cursor: pointer">
          <span @click="editCustomerIndex(index)" style="margin-right: 2px;color:#2d8cf0">编辑</span> |
          <span @click="removeCustomerIndex(index)" style="margin-left: 2px;color: #ed4014">删除</span>
        </div>
      </template>
  </Table>
<!--  编辑的From-->
  <Modal v-model="showEditIndex" title="编辑我的客户权益记录" :loading="modifyLoading" @on-ok="submitModifyIndex">
    <Form :label-width="80">
      <FormItem label="留存">
        <Input type="number" v-model="currentRowIndexData.remain"></Input>
      </FormItem>
      <FormItem label="利息">
        <Input type="number" v-model="currentRowIndexData.interest"></Input>
      </FormItem>
      <FormItem label="权益">
        <Input type="number" v-model="currentRowIndexData.crights"></Input>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import {
  getUserCustomer,
  queryCustomerIndex,
  modifyCustomerIndex,
  removeCustomerIndex
} from '@/api/income-point'
import { mapState } from 'vuex'
export default {
  name: 'income-my',
  data () {
    return {
      userCustomerList: [],
      customerColumns: [
        {
          title: '客户名称',
          key: 'customer_name',
          align: 'center'
        },
        {
          title: '账户',
          key: 'account',
          align: 'center'
        },
        {
          title: '权益明细',
          slot: 'detail',
          align: 'center'
        }
      ],

      currentCustomerName: '',
      customerIndexes: [],
      customerIndexColumns: [
        {
          title: '记录日期',
          key: 'create_time',
          align: 'center'
        },
        {
          title: '留存',
          key: 'remain',
          align: 'center'
        },
        {
          title: '利息',
          key: 'interest',
          align: 'center'
        },
        {
          title: '权益',
          key: 'crights',
          align: 'center'
        },
        {
          title: '收入',
          align: 'center',
          render: (h, params) => {
            return h('div', {}, params.row.remain + params.row.interest)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          slot: 'actions'
        }
      ],

      showEditIndex: false,
      currentRowIndexData: {},
      modifyLoading: false
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token
    })
  },
  watch: {
    showEditIndex () {
      if (!this.showEditIndex) {
        this.currentRowIndexData = {}
      }
    }
  },
  mounted () {
    this.getCurUserCustomers()
  },
  methods: {
    // 获取当前用户的所有客户
    getCurUserCustomers () {
      getUserCustomer(this.userToken).then(res => {
        this.userCustomerList = res.data.customers
      }).catch(() => { this.$Message.error('获取客户列表失败!') })
    },

    showCustomerDetail (rowData) {
      const cstId = rowData.id
      this.currentCustomerName = rowData.customer_name
      queryCustomerIndex(cstId).then(res => {
        console.log(res)
        this.customerIndexes = res.data.indexes
      }).catch(() => {
        this.$Message.error('查询记录失败了!')
      })
    },

    // 编辑一条客户权益记录
    editCustomerIndex (rowIndex) {
      this.currentRowIndexData = this.customerIndexes[rowIndex]
      this.showEditIndex = true
    },
    submitModifyIndex () {
      const bodyData = {
        user_token: this.userToken,
        index_id: this.currentRowIndexData.id,
        remain: this.currentRowIndexData.remain,
        interest: this.currentRowIndexData.interest,
        crights: this.currentRowIndexData.crights
      }
      modifyCustomerIndex(bodyData, bodyData.index_id).then(() => {
        this.modifyLoading = false
        this.showEditIndex = false
        this.$Message.success('修改成功!')
      }).catch(() => {
        this.modifyLoading = false
        this.showEditIndex = false
        this.$Message.error('修改失败了!')
      })
    },

    // 删除一条客户权益记录
    removeCustomerIndex (rowIndex) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除吗？删除将不可恢复!',
        onOk: () => {
          const curId = this.customerIndexes[rowIndex].id
          removeCustomerIndex(curId, this.userToken).then(() => {
            this.customerIndexes.splice(rowIndex, 1)
            this.$Message.success('删除成功!')
          }).catch(() => { this.$Message.error('删除失败!') })
        }
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
