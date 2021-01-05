import axios from '@/libs/api.request'

export const getAllMonthStatistics = (userToken) => {
  return axios.request({
    url: 'api/statistics/month-count/',
    params: { user_token: userToken },
    method: 'get'
  })
}
