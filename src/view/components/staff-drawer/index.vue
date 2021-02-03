<template>
<!--  封装选择人员的组件-->
  <div>
    <drag-drawer title="全部人员" placement="left" v-model="tempShow" @on-visible-change="visibleChange">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAllStaff"
        @click.prevent.native="handleCheckAll"
      >全选
      </Checkbox>
    </div>
    <CheckboxGroup v-model="checkedStaff" @on-change="checkAllGroupChange">
      <List item-layout="vertical">
        <ListItem v-for="userItem in systemUsers" :key="userItem.id">
          <Checkbox :label="userItem.id">{{userItem.username}}</Checkbox>
        </ListItem>
      </List>
    </CheckboxGroup>
  </drag-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserGroupIds } from '@/libs/util'
import DragDrawer from '_c/drag-drawer'
export default {
  name: 'StaffDrawer',
  components: {
    DragDrawer
  },
  props: ['showStaffDrawer'],
  computed: {
    ...mapState({
      systemUsers: state => state.user.systemUsers
    })
  },
  watch: {
    showStaffDrawer (isShow) {
      this.tempShow = isShow
    },
    checkedStaff (newVal) {
      this.checkStaffsChanged(newVal)
    }
  },
  mounted () {
    this.allStaffId = getUserGroupIds(this.systemUsers)
    this.checkedStaff = this.allStaffId
    this.indeterminate = false
  },
  data () {
    return {
      tempShow: this.showStaffDrawer,
      checkedStaff: [],
      allStaffId: [],
      indeterminate: true,
      checkAllStaff: true
    }
  },
  methods: {
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
    visibleChange (visible) {
      this.$emit('visibleChange', visible)
    },
    checkStaffsChanged (staffVal) {
      this.$emit('checkedChange', staffVal)
    }
  }
}
</script>

<style scoped>

</style>
