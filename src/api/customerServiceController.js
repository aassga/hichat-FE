import { axios } from '../libs/axios/api.request'

// 發起客服評價
export const createCustomerRating = data => {
  let postData = {
    url: '/api/customer/createCustomerRating',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 提交客服評價
export const submitCustomerRating = data => {
  let postData = {
    url: '/api/customer/submitCustomerRating',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//查詢客服評價列表
export const getCustomerRating = (params) => {
  let postData = {
    url: '/api/customer/getCustomerRating',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//查詢尚未提交客服評價列表
export const getUnsubmittedCustomerRating = (params) => {
  let postData = {
    url: '/api/customer/getUnsubmittedCustomerRating',
    method: 'get',
    params
  }
  return axios.request(postData)
}
