import {
  getVarieties
} from '@/api/variety'

export default {
  state: {
    varietyList: [],
    hasGetVariety: false
  },
  mutations: {
    setVarieties (state, varieties) {
      state.varietyList = varieties
    },
    setHasGetVariety (state, status) {
      state.hasGetVariety = status
    }
  },
  getters: {
  },
  actions: {
    // 获取系统所有品种
    getAllVarieties ({ commit }) {
      return new Promise((resolve, reject) => {
        getVarieties().then(res => {
          const data = res.data
          commit('setVarieties', data.varieties)
          commit('setHasGetVariety', true)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
