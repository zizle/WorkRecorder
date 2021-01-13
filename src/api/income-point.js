import axios from '@/libs/api.request'

// 获取当前用户的所有客户
export const getUserCustomer = (userToken) => {
  return axios.request({
    url: 'api/income/customers/',
    params: { user_token: userToken },
    method: 'get'
  })
}

// 添加一个客户
export const addNewCustomer = (data) => {
  return axios.request({
    url: 'api/income/customer/add/',
    data,
    method: 'post'
  })
}

// 为客户添加一条记录
export const addNewCustomerIndex = (data) => {
  return axios.request({
    url: 'api/income/customer/index/add/',
    data,
    method: 'post'
  })
}

// 查询一个客户的权益记录
export const queryCustomerIndex = (customerId) => {
  return axios.request({
    url: 'api/income/customer/index/detail/',
    params: { customer_id: customerId },
    method: 'get'
  })
}

// 修改一条权益记录
export const modifyCustomerIndex = (data, indexId) => {
  return axios.request({
    url: 'api/income/customer/index/modify/' + indexId + '/',
    data,
    method: 'put'
  })
}

// 删除一条权益记录
export const removeCustomerIndex = (indexId, userToken) => {
  return axios.request({
    url: 'api/income/customer/index/remove/' + indexId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}

// 统计用户的客户数量以及权益
export const getStatisticsCustomerRevenue = (userToken, is_audit) => {
  return axios.request({
    url: 'api/income/statistics/',
    params: { user_token: userToken, is_audit: is_audit },
    method: 'get'
  })
}
