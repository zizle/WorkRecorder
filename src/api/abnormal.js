import axios from '@/libs/api.request'

export const addAbnormal = (formData) => {
  return axios.request({
    url: 'api/abnormal/add/',
    data: formData,
    method: 'post'
  })
}

export const queryAbnormal = (data) => {
  return axios.request({
    url: 'api/abnormal/',
    data,
    method: 'post'
  })
}

export const modifyAbnormal = (formData, abnormalId) => {
  return axios.request({
    url: 'api/abnormal/modify/' + abnormalId + '/',
    data: formData,
    method: 'put'
  })
}

export const deleteOneAbnormal = (abnormalId, userToken) => {
  return axios.request({
    url: 'api/abnormal/remove/' + abnormalId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}

export const getMonthAbnormalStatistics = (queryDate) => {
  return axios.request({
    url: 'api/abnormal/statistics/month/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

export const getYearAbnormalStatistics = (queryDate) => {
  return axios.request({
    url: 'api/abnormal/statistics/year/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

// 用户获取自己当年的累计数
export const getAbnormalYearTotal = (userToken) => {
  return axios.request({
    url: 'api/abnormal/statistics/year-total/',
    params: { user_token: userToken },
    method: 'get'
  })
}
