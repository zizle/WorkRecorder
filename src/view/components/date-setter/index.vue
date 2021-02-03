<template>
<!--    选择日期段的组件-->
  <div>
<!--    <Row :gutter="16" type="flex" justify="start" align="middle">-->
<!--      <Col offset=1><span>开始日期:</span></Col>-->
<!--      <Col><DatePicker v-model="startDate" size="small" style="width:115px" @on-change="startDateChanged"></DatePicker></Col>-->
<!--      <Col><span>结束日期:</span></Col>-->
<!--      <Col><DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker></Col>-->
<!--    </Row>-->
      <span style="margin-right:5px">开始日期:</span>
      <DatePicker v-model="startDate" size="small" style="width:115px;" @on-change="startDateChanged"></DatePicker>
      <span style="margin-right:5px;margin-left:12px">结束日期:</span>
      <DatePicker v-model="endDate" size="small" style="width:115px" @on-change="endDateChanged"></DatePicker>
  </div>
</template>

<script>
import { dateToString } from '@/libs/util'
export default {
  name: 'dateSetter',
  data () {
    return {
      startDate: new Date(),
      endDate: new Date()
    }
  },
  mounted () {
    this.setPreMonthDate()
  },
  methods: {
    setPreMonthDate () {
      const cDate = new Date()
      cDate.setMonth(cDate.getMonth() - 1)
      cDate.setDate(1)
      this.startDate = cDate
    },
    startDateChanged (dateStr) {
      if (dateStr > dateToString(this.endDate)) {
        this.$Modal.error({ title: '错误', content: '开始日期需要小于等于结束日期!' })
        this.startDate = this.endDate
      }
    },
    endDateChanged (dateStr) {
      if (dateStr < dateToString(this.startDate)) {
        this.$Modal.error({ title: '错误', content: '结束日期需要大于等于开始日期!' })
        this.endDate = this.startDate
      }
    }
  }
}
</script>

<style scoped>

</style>
