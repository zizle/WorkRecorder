import axios from '@/libs/api.request'

export const addStrategy = (formData) => {
  return axios.request({
    url: 'api/strategy/',
    data: formData,
    method: 'post'
  })
}
