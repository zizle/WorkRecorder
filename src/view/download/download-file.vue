<template>
<div>
  <div class="download">
    <p style="font-size:28px">分析决策系统(研究员)下载</p>
    <p style="font-size:18px">最新版本: <a href="http://210.13.218.130:9004/static/INSTALLER/INSIDE/FAClientInsideSetup_1.5.3.exe">Windows-7 Windows-10 Version 1.5.3</a></p>
    <p style="font-size:12px">发布日期: 2021年02月01日</p>
    <p>特别说明:<p>
    <p>由于权限的管理,<span style="color:rgb(210,55,55)">首次</span>安装注册用户后,请进入菜单<span>"关于系统"</span> - <span>"版本检查"</span>将<span>客户端号</span>提供给管理员开通登录.</p>
    <p style="color:rgb(233,66,66);font-weight:bold">--安装时若有360等软件拦截请允许通过,否则可能无法使用！--</p>
  </div>
  <hr>
  <div>
    <p style="font-size:28px">数据上传EXCEL模板文件下载</p>
    <p style="font-size:18px"><a :href="modelExcelUrl">工作记录系统数据上传EXCEL模板文件</a></p>
  </div>
</div>
</template>

<script>
import config from '@/config'
export default {
  name: 'download-file',
  data () {
    return {
      modelExcelUrl: ''
    }
  },
  mounted () {
    const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    console.log(baseUrl)
    this.modelExcelUrl = baseUrl + 'static/工作数据上传模板.xlsx'
  },
  methods: {
  }
}
</script>

<style scoped>
.download span{
  color:rgb(233,66,66)
}
</style>
