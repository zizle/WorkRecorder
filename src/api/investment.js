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
