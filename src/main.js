import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css/normalize.css";
import "./plugins/flexible";
import "./plugins/element.js";
import "./permission";
//导入字体图标
import "./assets/fonts/iconfont.css"
import "./assets/css/global.css"
import axios from "axios"


import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


Vue.config.productionTip = false;
// axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/',
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/',


axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.use(VueQuillEditor, /* { default global options } */)


Vue.prototype.$http = axios

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");