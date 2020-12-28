<template>
  <div>
    <Table stripe :columns="userTableColumns" :data="userList" :loading="onLoading"></Table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserList } from '@/api/user'
export default {
  name: 'user-managed',
  data () {
    return {
      onLoading: true,
      userList: [],
      userTableColumns: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '加入时间',
          key: 'join_time',
          maxWidth: 100
        },
        {
          title: '最近登录',
          key: 'update_time',
          maxWidth: 100
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
          key: 'organization_name'
        },
        {
          title: '管理员',
          key: 'is_admin',
          maxWidth: 80,
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  type: 'primary',
                  value: params.row.is_admin === 1
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': value => {
                    this.switchUserAdmin(params.row.id, value)
                  }
                }
              })
            ])
          }
        },
        {
          title: '在职',
          key: 'is_active',
          maxWidth: 80,
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
      userToken: state => state.user.token
    })
  },
  mounted () {
    // 获取用户列表
    this.getAllUser()
  },
  methods: {
    getAllUser () {
      getUserList(this.userToken).then(res => {
        this.onLoading = false
        this.userList = res.data.users
      })
    },
    switchUserAdmin (userId, switchVal) {
      console.log(userId)
      console.log(switchVal)
    },
    switchUserActive (userId, switchVal) {
      console.log(userId)
      console.log(switchVal)
    }
  }
}
</script>

<style scoped>

</style>
