<template>
  <div ref="content">
    <div class="anchor">
      <Anchor show-ink @on-select="selectAnchor">
        <AnchorLink href="#homepage" title="首页"></AnchorLink>
        <AnchorLink href="#shortmsg" title="短讯通">
          <AnchorLink href="#shortmsg_exceladd" title="EXCEL上传"></AnchorLink>
        </AnchorLink>
      </Anchor>
    </div>
    <div class="container">
      <div style="height:800px">
        <div id="homepage"></div>
        <h3 >首页</h3>
      </div>
      <div style="height:700px">
        <div id="shortmsg"></div>
        <h3>短讯通</h3>
        <div style="height: 200px">
          <h4 id="shortmsg_exceladd">EXCEL上传</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'helper',
  methods: {
    selectAnchor (href) {
      // console.log(href.substring(1))
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
    overflow: auto;
    /*height: 82vh;*/
    background-color: #5c6b77;
  }
</style>
