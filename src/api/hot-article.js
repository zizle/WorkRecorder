import axios from '@/libs/api.request'

export const addHotArticle = (formData) => {
  return axios.request({
    url: 'api/article/add/',
    data: formData,
    method: 'post'
  })
}

export const queryHotArticle = (data) => {
  return axios.request({
    url: 'api/article/',
    data,
    method: 'post'
  })
}

export const modifyHotArticle = (formData, articleId) => {
  return axios.request({
    url: 'api/article/modify/' + articleId + '/',
    data: formData,
    method: 'put'
  })
}

export const deleteOneArticle = (articleId, userToken) => {
  return axios.request({
    url: 'api/article/remove/' + articleId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}

export const getMonthArticleStatistics = (queryDate) => {
  return axios.request({
    url: 'api/article/statistics/month/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

export const getYearArticleStatistics = (queryDate) => {
  return axios.request({
    url: 'api/article/statistics/year/',
    params: { query_date: queryDate },
    method: 'get'
  })
}

// 用户获取自己当年的累计数
export const getArticleYearTotal = (userToken, currency) => {
  return axios.request({
    url: 'api/article/statistics/year-total/',
    params: { user_token: userToken, currency: currency },
    method: 'get'
  })
}

// 根据参数获取用户数据
export const getHotArticleRecords = ({ currency, start, end, kw }) => {
  return axios.request({
    url: 'api/article/statistics/',
    params: { currency: currency, start: start, end: end, kw: kw },
    method: 'get'
  })
}
