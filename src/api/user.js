import axios from '@/libs/api.request'

export const createUser = (userData) => {
  return axios.request({
    url: 'api/user/add/',
    data: userData,
    method: 'post'
  })
}

export const setUserAccess = (userAccess, userToken) => {
  return axios.request({
    url: 'api/user/access/',
    data: userAccess,
    params: { user_token: userToken },
    method: 'post'
  })
}

export const login = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password
  }
  return axios.request({
    url: 'api/user/login/',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'api/user/info/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getUserList = (token) => {
  return axios.request({
    url: 'api/user/list/',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'api/user/message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'api/user/message/init/',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'api/user/message/content/',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'api/user/message/has-read/',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'api/user/message/remove-readed/',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'api/user/message/restore/',
    method: 'post',
    data: {
      msg_id
    }
  })
}
