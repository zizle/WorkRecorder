import axios from '@/libs/api.request'

export const addStrategy = (formData) => {
  return axios.request({
    url: 'api/strategy/add/',
    data: formData,
    method: 'post'
  })
}

export const queryStrategy = (data) => {
  return axios.request({
    url: 'api/strategy/',
    data,
    method: 'post'
  })
}

export const modifyOneStrategy = (data) => {
  return axios.request({
    url: 'api/strategy/modify/' + data.strategy_id + '/',
    data,
    method: 'put'
  })
}

export const deleteOneStrategy = (straId, userToken) => {
  return axios.request({
    url: 'api/strategy/remove/' + straId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}

export const getMonthStrategyStatistics = (queryDate) => {
  return axios.request({
    url: 'api/strategy/statistics/month/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

export const getYearStrategyStatistics = (queryDate) => {
  return axios.request({
    url: 'api/strategy/statistics/year/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

// 用户获取自己当年的累计数
export const getStrategyYearTotal = (userToken) => {
  return axios.request({
    url: 'api/strategy/statistics/year-total/',
    params: { user_token: userToken },
    method: 'get'
  })
}
