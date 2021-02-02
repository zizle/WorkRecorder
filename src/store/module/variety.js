import {
  getVarieties
} from '@/api/variety'

export default {
  state: {
    varietyList: []
  },
  mutations: {
    setVarieties (state, varieties) {
      state.varietyList = varieties
    }
  },
  getters: {
  },
  actions: {
    // 获取系统所有品种
    getAllVarieties ({ commit }) {
      console.log('请求系统品种')
      return new Promise((resolve, reject) => {
        getVarieties().then(res => {
          const data = res.data
          commit('setVarieties', data.varieties)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
