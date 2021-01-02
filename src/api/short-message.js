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
