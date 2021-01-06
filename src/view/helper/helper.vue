<template>
  <div ref="content">
    <div class="anchor">
      <Anchor show-ink @on-select="selectAnchor" :affix="false">
        <AnchorLink href="#homepage" title="首页"></AnchorLink>
        <AnchorLink href="#shortmsg" title="短讯通">
          <AnchorLink href="#shortmsg_exceladd" title="EXCEL上传"></AnchorLink>
          <AnchorLink href="#my_shortmsg" title="我的短讯通"></AnchorLink>
        </AnchorLink>
      </Anchor>
    </div>
    <div class="container">
      <div>
        <div id="homepage"></div>
        <h3 class="helper-title">首页</h3>
        <img class="helper-img" :src="homePageImg" alt="首页介绍">
      </div>
      <div>
        <div id="shortmsg"></div>
        <h3 class="helper-title">短讯通</h3>
        <div>
          <h4 id="shortmsg_exceladd" class="sub-helper-title">EXCEL上传</h4>
          <hr>
          <img class="helper-img" :src="shtMsgExcelAddImg" alt="短讯通EXCEL上传">
        </div>
        <div>
          <h4 id="my_shortmsg" class="sub-helper-title">我的短讯通</h4>
          <hr>
          <img class="helper-img" :src="myShtMsgImg" alt="我的短讯通">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homePageImg from '@/assets/helper/homepage.jpg'
import shtMsgExcelAddImg from '@/assets/helper/shtmsgexceladd.jpg'
import myShtMsgImg from '@/assets/helper/myshtmsg.jpg'
export default {
  name: 'helper',
  data () {
    return {
      homePageImg,
      shtMsgExcelAddImg,
      myShtMsgImg
    }
  },
  methods: {
    selectAnchor (href) {
      document.getElementById(href.substring(1)).scrollIntoView()
    }
  }
}
</script>

<style>
.anchor{
  display: inline-block;
  width: 19%;
  /*background-color: #2d8cf0;*/
  vertical-align: top;
  margin-right: 1%;
}
  .container{
    display: inline-block;
    width: 80%;
    /*overflow: auto;*/
    /*height: 82vh;*/
  }
  .helper-img{
    width: 100%;
  }
  .helper-title{
    margin: 5px;
    color: #ffffff;
    padding-left: 8px;
    background-color: #1890ff;
  }
  .sub-helper-title{
    margin: 3px;
    padding-left: 12px;
  }
</style>
