<template>
  <div>品种列表, <button @click="showVarieties">查看品种</button></div>

</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      varietyList: state => state.variety.varietyList
    })
  },
  methods: {
    ...mapActions([
    ]),
    showVarieties () {
      console.log(this.varietyList)
    }
  }
}
</script>

<style>
</style>
