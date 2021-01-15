<template>
  <div>
    <Table border stripe size="small" :columns="userTableColumns" :data="userList" :loading="tableOnLoading">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="info" size="small" @click="handleUserAccess(row)">分配</Button>
      </template>
    </Table>
    <Modal v-model="isEditingUserAccess" :loading="auditLoading" :title="auditModalTitle" @on-ok="confirmUserAudit">
      <div>
        <CheckboxGroup v-model="auditModalAccess">
          <Checkbox label="short_message">短讯通审核</Checkbox>
          <Checkbox label="strategy">投顾策略</Checkbox>
          <Checkbox label="investment">投资方案</Checkbox>
          <Checkbox label="abnormal_work">非常态工作</Checkbox>
          <Checkbox label="revenue">收入指标</Checkbox>
          <Checkbox label="article">热点文章</Checkbox>
        </CheckboxGroup>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setUserAccess } from '@/api/user'
export default {
  name: 'user-managed',
  data () {
    return {
      isEditingUserAccess: false,
      auditModalTitle: '',
      auditModalAccess: [],
      auditModalCurrentId: 0,
      auditLoading: false,
      // userList: [],
      tableOnLoading: false,
      userTableColumns: [
        {
          title: '用户名',
          key: 'username',
          width: 80
        },
        {
          title: '加入时间',
          key: 'join_time'
        },
        {
          title: '最近登录',
          key: 'update_time'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '部门小组',
          key: 'organization_name',
          width: 110
        },
        {
          title: '权限分配',
          slot: 'action',
          width: 100,
          align: 'center'
        },
        {
          title: '在职',
          key: 'is_active',
          maxWidth: 70,
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  type: 'primary',
                  value: params.row.is_active === 1
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': value => {
                    this.switchUserActive(params.row.id, value)
                  }
                }
              })
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      userList: state => state.user.systemUsers
    })
  },
  mounted () {
  },
  methods: {
    handleUserAccess (userItem) {
      this.auditModalTitle = '正在分配【' + userItem.username + '】的审核权限'
      this.auditModalAccess = userItem.access
      this.isEditingUserAccess = true
      this.auditModalCurrentId = userItem.id
    },
    confirmUserAudit () {
      const userAccess = {
        user_id: this.auditModalCurrentId,
        user_access: this.auditModalAccess
      }
      this.auditLoading = true
      setUserAccess(userAccess, this.userToken).then(res => {
        this.auditLoading = false
        this.$Message.success('设置成功！')
      }).catch(() => {
        this.auditLoading = false
        this.$Message.error('设置失败!')
      })
    },
    switchUserActive (userId, switchVal) {
      console.log(userId)
      console.log(switchVal)
      this.$Message.error('设置无效,该功能未上线。')
    }
  }
}
</script>

<style scoped>

</style>
