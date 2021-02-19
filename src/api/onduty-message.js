import axios from '@/libs/api.request'

export const ondutyUploadExcel = (formData) => {
  return axios.request({
    url: 'api/onduty/excel/',
    data: formData,
    method: 'post'
  })
}

export const getOndutyMessage = (data) => {
  return axios.request({
    url: 'api/onduty/',
    data,
    method: 'post'
  })
}

export const delOndutyMessageRecord = (msgId, userToken) => {
  return axios.request({
    url: 'api/onduty/' + msgId + '/',
    method: 'delete',
    params: { user_token: userToken }
  })
}

export const delOndutyMsgWithJoinTime = (data) => {
  return axios.request({
    url: 'api/onduty/excel/',
    data,
    method: 'delete'
  })
}

// 请求月排名数据
export const getMonthOndutyMsgStatistics = (sDate) => {
  return axios.request({
    url: 'api/onduty/statistics/month/',
    params: { query_date: sDate },
    method: 'get'
  })
}
// 请求月日详情数据
// export const getOndutyMonthDetail = (sDate) => {
//   return axios.request({
//     url: 'api/onduty/statistics/month-detail/',
//     params: { query_date: sDate },
//     method: 'get'
//   })
// }

// 请求年排名数据
export const getYearOndutyMsgStatistics = (sDate) => {
  return axios.request({
    url: 'api/onduty/statistics/year/',
    params: { query_date: sDate },
    method: 'get'
  })
}
// // 请求年里的月详情数据
// export const getYearDetail = (sDate) => {
//   return axios.request({
//     url: 'api/onduty/statistics/year-detail/',
//     params: { query_date: sDate },
//     method: 'get'
//   })
// }

// 用户获取自己当年的累计数
export const getOndutyMsgYearTotal = (userToken, currency) => {
  return axios.request({
    url: 'api/onduty/statistics/year-total/',
    params: { user_token: userToken, currency: currency },
    method: 'get'
  })
}

// 根据获取用户数据
export const getOndutyMsgRecords = ({ currency, start, end, kw }) => {
  return axios.request({
    url: 'api/onduty/statistics/',
    params: { currency: currency, start: start, end: end, kw: kw },
    method: 'get'
  })
}
