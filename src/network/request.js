import axios from "axios"

import qs from "qs"



export function request(config) {
  //1.创建axios实例
  const instance = axios.create({
    // baseURL: 'http://47.115.124.102:8888/api/private/v1/',
    // baseURL:'http://timemeetyou.com:8889/api/private/v1/',
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  //2.1请求拦截的作用
  // instance.interceptors.request.use(config => {
  //   console.log(config);
  //   //1.比如config中的信息不符合服务器的要求
  //   //2.比如每次发送网络请求时，都希望在界面中显示一个请求的图标
  //   //3.某些网络请求（比如登录（token）），必须携带一些特殊的信息
  //   return config
  // }, err => {
  //   console.log(err)
  // });
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  //2.2响应拦截
  // instance.interceptors.response.use(res => {
  //   console.log(res)
  //   return res.data
  // }, err => {
  //   console.log(err)
  // });
  //发送真正的网络请求
  return instance(config)
}

export function get(url, data) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: data
    }).then((res) => {
      if (res) {
        //成功回调
        resolve(res);
      }
    }).catch((error) => {
      reject(error);
    })
  })
}



export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    }).then((res) => {
      if (res) {
        //成功回调
        resolve(res);
      }
    }).catch((error) => {
      reject(error);
    })
  })
}

export function PUT(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then((res) => {
      if (res) {
        //成功回调
        resolve(res);
      }
    }).catch((error) => {
      reject(error);
    })
  })
}

export function Delete(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {params : params}).then((res) => {
      if (res) {
        resolve(res);
      }
    }).catch((error) => {
      reject(error);
    })
  })
}


// export const PUT = (url, params) => {
//   return axios.put(`${base}${url}`, params).then(res => res.data)
// }


// export const DELETE = (url, params) => {
//   return axios.delete(`${base}${url}`, { params: params }).then(res => res.data)
// }

// export const PATCH = (url, params) => {
//   return axios.patch(`${base}${url}`, params).then(res => res.data)
// }