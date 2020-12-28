import axios from '@/libs/api.request'

export const getVarieties = () => {
  return axios.request({
    url: 'api/variety/all/',
    method: 'get'
  })
}
