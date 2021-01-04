import axios from '@/libs/api.request'

export const uploadExcel = (formData) => {
  return axios.request({
    url: 'api/shtmsg/excel/',
    data: formData,
    method: 'post'
  })
}

export const getShortMessage = (data) => {
  return axios.request({
    url: 'api/shtmsg/',
    data,
    method: 'post'
  })
}

export const getAuditShortMessage = (data) => {
  return axios.request({
    url: 'api/shtmsg/audit/',
    data,
    method: 'post'
  })
}

export const updateMsgAuditMind = (data, msgId) => {
  return axios.request({
    url: 'api/shtmsg/audit/' + msgId + '/',
    data,
    method: 'put'
  })
}

export const delMessageRecord = (msgId, userToken) => {
  return axios.request({
    url: 'api/shtmsg/' + msgId + '/',
    method: 'delete',
    params: { user_token: userToken }
  })
}

// 请求月排名数据
export const getMonthRank = (sDate) => {
  return axios.request({
    url: 'api/shtmsg/statistics/month-rank/',
    params: { query_date: sDate },
    method: 'get'
  })
}
// 请求月日详情数据
export const getMonthDetail = (sDate) => {
  return axios.request({
    url: 'api/shtmsg/statistics/month-detail/',
    params: { query_date: sDate },
    method: 'get'
  })
}

// 请求年排名数据

// 请求年里的月详情数据
