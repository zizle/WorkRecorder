<template>
  <div>
    <Card>
    <Form :label-width="80" :model="formData">
      <FormItem label="方案日期">
        <DatePicker v-model="formData.create_date" placeholder="选择方案建立的日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="方案标题">
        <Input placeholder="投资方案的标题" type="text" v-model="formData.title"></Input>
      </FormItem>
      <FormItem label="品种" prop="variety_en">
        <Select filterable clearable v-model="formData.variety_en">
          <Option v-for="item in varietyList" :key="item.id" :value="item.variety_en">{{ item.variety_name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="合约月份" prop="contract">
        <Input placeholder="录入品种4位数合约月份" type="number" v-model="formData.contract"></Input>
      </FormItem>
      <FormItem label="投资方向">
        <RadioGroup v-model="formData.direction">
          <Radio label="多头">多头</Radio>
          <Radio label="空头">空头</Radio>
          <Radio label="套利">套利</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="实建均价" prop="contract">
        <Input placeholder="" type="number" v-model="formData.build_price"></Input>
      </FormItem>
      <FormItem label="实建手数" prop="contract">
        <Input placeholder="" type="number" v-model="formData.build_hands"></Input>
      </FormItem>
      <FormItem label="实出均价" prop="contract">
        <Input placeholder="" type="number" v-model="formData.sale_price"></Input>
      </FormItem>
      <FormItem label="止损均价" prop="contract">
        <Input placeholder="" type="number" v-model="formData.cutloss_price"></Input>
      </FormItem>
      <FormItem label="有效期止" prop="contract">
        <DatePicker v-model="formData.expire_date" placeholder="选择方案的有效日期" :clearable="false"></DatePicker>
      </FormItem>
      <FormItem label="方案结果" placeholder="用`+`和`-`表示盈亏" prop="cutloss_price">
        <Input placeholder="" type="number" v-model="formData.cutloss_price"></Input>
      </FormItem>
      <FormItem label="是否外发">
        <RadioGroup v-model="formData.is_publish">
          <Radio :label=1>是</Radio>
          <Radio :label=0>否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="方案评级" prop="level">
        <Select filterable clearable v-model="formData.level">
          <Option :value=5>五级</Option>
          <Option :value=4>四级</Option>
          <Option :value=3>三级</Option>
          <Option :value=2>二级</Option>
          <Option :value=1>一级</Option>
        </Select>
      </FormItem>
      <FormItem label="备注">
        <Input type="text" placeholder="备注" v-model="formData.note"></Input>
      </FormItem>
      <FormItem label="附件">
        <Upload action="">
          <Button icon="ios-cloud-upload-outline">选择附件(多文件请使用压缩包)</Button>
        </Upload>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitInvestment">提交</Button>
        <Button style="margin-left: 8px" @click="handleReset">重置</Button>
      </FormItem>
    </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'investment-add',
  data () {
    return {
      formData: {
        create_date: new Date(),
        title: '',
        variety_en: '',
        contract: '',
        direction: '多头',
        build_price: '',
        build_hands: '',
        sale_price: '',
        cutloss_price: '',
        expire_date: '',
        is_publish: 1,
        level: '',
        note: ''
      }
    }
  },
  computed: {
    ...mapState({
      userToken: state => state.user.token,
      varietyList: state => state.variety.varietyList
    })
  },
  methods: {
    submitInvestment () {

    },
    handleReset () {

    }
  }
}
</script>

<style scoped>

</style>
