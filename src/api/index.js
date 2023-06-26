import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/api/sso/loginByPhone',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//登出
export const logout = data => {
  let postData = {
    url: '/api/sso/logout',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//註冊
export const register = data => {
  let postData = {
    url: '/api/sso/registerByPhone',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 產生驗證碼
export const genAuthCode = (params) => {
  let postData = {
    url: '/api/sso/genPhoneAuthCode',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 忘記密碼
export const forgetPassword = data => {
  let postData = {
    url: '/api/sso/forgetPasswordByPhone',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 刪除帳號
export const deleteUser = data => {
  let postData = {
    url: '/api/sso/deleteUser',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 解鎖密碼
export const unlockUser = data => {
  let postData = {
    url: '/api/sso/unlockUserByPhone',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改密碼
export const updatePassword = data => {
  let postData = {
    url: '/api/sso/updatePasswordByPhone',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 修改密碼
export const updateDeviceInfo = data => {
  let postData = {
    url: '/api/sso/updateDeviceInfo',
    method: 'post',
    data
  };
  return axios.request(postData);
}

// 國際碼列表
export const getCountryList = (params) => {
  let postData = {
    url: '/api/sso/getCountryList',
    method: 'get',
    params
  }
  return axios.request(postData)
}


























