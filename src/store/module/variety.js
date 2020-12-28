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
    getVarietyList: state => state.varietyList
  },
  actions: {
    // 获取系统所有品种
    getAllVarieties ({ commit }) {
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
