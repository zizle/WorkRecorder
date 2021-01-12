import axios from '@/libs/api.request'

export const addInvestment = (formData) => {
  return axios.request({
    url: 'api/investment/add/',
    data: formData,
    method: 'post'
  })
}

export const queryInvestment = (data) => {
  return axios.request({
    url: 'api/investment/',
    data,
    method: 'post'
  })
}

export const modifyInvestment = (formData, investmentId) => {
  return axios.request({
    url: 'api/investment/modify/' + investmentId + '/',
    data: formData,
    method: 'put'
  })
}

export const deleteOneInvestment = (investmentId, userToken) => {
  return axios.request({
    url: 'api/investment/remove/' + investmentId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}

export const getMonthInvestmentStatistics = (queryDate) => {
  return axios.request({
    url: 'api/investment/statistics/month/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

export const getYearInvestmentStatistics = (queryDate) => {
  return axios.request({
    url: 'api/investment/statistics/year/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

// 用户获取自己当年的累计数
export const getInvestmentYearTotal = (userToken) => {
  return axios.request({
    url: 'api/investment/statistics/year-total/',
    params: { user_token: userToken },
    method: 'get'
  })
}
