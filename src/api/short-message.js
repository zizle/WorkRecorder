import axios from '@/libs/api.request'
export const uploadExcel = (formData) => {
  return axios.request({
    url: 'api/shtmsg/excel/',
    data: formData,
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
