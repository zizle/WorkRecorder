import axios from '@/libs/api.request'

export const uploadExcel = (formData) => {
  return axios.request({
    url: 'api/shtmsg/excel/',
    data: formData,
    method: 'post'
  })
}

export const getUserShortMessage = (userToken, page, pageSize) => {
  return axios.request({
    url: 'api/shtmsg/',
    params: {
      page: page,
      page_size: pageSize,
      user_token: userToken
    },
    method: 'get'
  })
}

export const getAuditShortMessage = (data) => {
  return axios.request({
    url: 'api/shtmsg/audit/',
    data,
    method: 'post'
  })
}

export const delMessageRecord = (msgId, userToken) => {
  return axios.request({
    url: 'api/shtmsg/' + msgId + '/',
    method: 'delete',
    params: { user_token: userToken }
  })
}
