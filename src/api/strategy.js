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

export const deleteOneStrategy = (straId, userToken) => {
  return axios.request({
    url: 'api/strategy/remove/' + straId + '/',
    params: { user_token: userToken },
    method: 'delete'
  })
}
