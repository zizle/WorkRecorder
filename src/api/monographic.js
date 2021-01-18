import axios from '@/libs/api.request'

export const getMonographic = (userToken) => {
  return axios.request({
    url: 'api/monographic/',
    params: { user_token: userToken },
    method: 'get'
  })
}
